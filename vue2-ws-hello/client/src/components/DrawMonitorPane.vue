<template>
  <a-card title="DrawMonitorPane" class="draw-monitor-pane w100"
    :head-style="{ 
      backgroundColor: 'royalblue',
      color: 'white',
    }"
    :body-style="{ padding: '0.8em' }">
    <div class="draw-monitor-item switch">
      <a-switch v-model="doShowDrawResultAsToast" />
      use pop message
    </div>
    <div class="draw-monitor-item"
    v-for="it in ticketLogList" v-bind:key="it.id">
      <span class='my teal circular label'>
        #{{ it.ticket }}
      </span>
    </div>
    <div v-if="personWon" class="draw-monitor-item">
      <span class='my orange circular label'>
        #{{ wonByTicket }}
      </span>
      <span class="my orange label">
        <i class="trophy icon"></i>
        {{ personWon }}
      </span>
    </div>
  </a-card>
</template>

<style scoped>
div.draw-monitor-item.switch {
  display: block;
  margin: 4px;
}
div.draw-monitor-item {
  display: inline-block;
  margin-left: 0;
  margin-right: 0.6em;
  height: 2.2em;
}
</style>

<script lang="ts">
import Vue from 'vue';
import { WSChannelService, WsMessage, WsMessageType } from '@/service/WSChannelService';
import { MessageService } from '@/service/MessageService';
import { rootStoreState } from '@/stores';

let debug = false;

export default Vue.extend({
  name: 'DrawMonitorPane',
  computed: {
    iWSChannelService: ()=>WSChannelService(),
    iMessageService: ()=>MessageService(),
  },
  created(){
    if (!rootStoreState.wsChannelStateStore.isConnected){
      if (debug) console.log('establish ws connection ...');
      this.iWSChannelService.connect();
    }
  },
  mounted(){
    this.resetTicketData();
    let job = setInterval(()=>{
      if (rootStoreState.wsChannelStateStore.isConnected) {
      this.iWSChannelService.listenToMessage(this.onMessage);
      this.isListeningWs = true;
      clearInterval(job);
    }
    }, 100);
  },
  destroyed(){
    if (this.isListeningWs) {
      this.iWSChannelService.stopListening(this.onMessage);
    }
  },
  data() {
    return {
      isListeningWs: false,
      personWon: null,
      wonByTicket: null,
      doShowDrawResultAsToast: true,
      ticketIdCounter: 1,
      ticketLogList: [],
    } as ViewModel;
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
    }
  }
});

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
</script>
