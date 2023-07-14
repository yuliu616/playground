<template>
  <div class="my huge card">
    <a-card title="DrawMonitorPane"
      :head-style="{ 
        backgroundColor: 'royalblue',
        color: 'white',
      }"
    >
      <div class="draw-monitor-item switch">
        <a-switch v-model:checked="doShowDrawResultAsToast" />
        use pop message
      </div>
      <div v-for="it in ticketLogList" :key="it.id"
        class="draw-monitor-item"
      >
        <a-tag color="teal">
          #{{ it.ticket }}
        </a-tag>
      </div>
      <div v-if="personWon" class="draw-monitor-item">
        <a-tag color="orange">
          #{{ wonByTicket }}
        </a-tag>
        <a-tag color="orange">
          <template #icon>
            <TrophyFilled />
          </template>
          {{ personWon }}
        </a-tag>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { MessageService } from '@/service/MessageService';
import { WsMessageType, type WsMessage } from '@/stores/WebSocketMessageStore';
import { useWebSocketMessageStore } from '@/stores/WebSocketMessageStore';
import { 
    TrophyFilled
  } from '@ant-design/icons-vue';

let debug = false;

interface ViewModel {
  isListeningWs: boolean;
  personWon: string | null;
  wonByTicket: number | null;
  doShowDrawResultAsToast: boolean;
  ticketIdCounter: number;
  ticketLogList: TicketItem[];
}

interface TicketItem {
  id: number;
  ticket: number;
}

export default {
  components: {
    TrophyFilled,
  },
  data(){
    return <ViewModel>{
      isListeningWs: false,
      personWon: null,
      wonByTicket: null,
      doShowDrawResultAsToast: true,
      ticketIdCounter: 1,
      ticketLogList: [],
    };
  },
  computed: {
    iMessageService: ()=>MessageService(),
    webSocketMessageStore: ()=>useWebSocketMessageStore(),
  },
  created() {
    if (!this.webSocketMessageStore.isConnected){
      if (debug) console.log('establish ws connection ...');
      this.webSocketMessageStore.connect();
    }
  },
  mounted() {
    this.resetTicketData();
    let job = setInterval(()=>{
      if (this.webSocketMessageStore.isConnected) {
        this.webSocketMessageStore.listenToMessage(this.onMessage);
        this.isListeningWs = true;
        clearInterval(job);
      }
    }, 100);
  },
  unmounted() {
    if (this.isListeningWs) {
      this.webSocketMessageStore.stopListening(this.onMessage);
    }
  },
  methods: {
    onMessage(message: WsMessage){
      if (debug) console.log('DrawMonitorPane.onMessage:', message);
      if (message.type == WsMessageType.ANNOUNCEMENT) {
        this.iMessageService.good(message.text || 'ANNOUNCEMENT', {
          durationSec: 3.0,
        });

      } else if (message.type == WsMessageType.DRAW_START) {
        this.iMessageService.good(message.text || 'DRAW_START', {
          durationSec: 6.0,
        });
        this.resetTicketData();

      } else if (message.type == WsMessageType.DRAW_RESULT) {
        this.ticketLogList.push({ 
          id: this.ticketIdCounter++, 
          ticket: message.data,
        });
        if (this.doShowDrawResultAsToast) {
          this.iMessageService.info(message.text || 'DRAW_RESULT', {
            durationSec: 0.8,
          });
        }

      } else if (message.type == WsMessageType.DRAW_END) {
        this.personWon = message.data.winnerInfo.name;
        this.wonByTicket = message.data.winnerInfo.guess;
        if (this.ticketLogList[this.ticketLogList.length-1].ticket == this.wonByTicket) {
          this.ticketLogList.splice(this.ticketLogList.length-1, 1);
        }
        this.iMessageService.info(message.text || 'DRAW_END', {
          doNoAutoClose: true,
        });

      }
    },
    resetTicketData(){
      this.ticketIdCounter = 1;
      this.ticketLogList = [];
      this.wonByTicket = null;
      this.personWon = null;
    },
  },
};
</script>

<style scoped>
div.draw-monitor-item.switch {
  display: block;
  margin: 4px;
}

div.draw-monitor-item {
  display: inline-block;
  margin-left: 0;
  margin-right: 0.4em;
  height: 2.2em;
}
</style>
