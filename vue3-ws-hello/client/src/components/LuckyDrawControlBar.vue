<template>
  <div class="my small card">
    <a-card title="LuckyDrawControlBar"
      :head-style="{ 
        backgroundColor: 'royalblue',
        color: 'white',
      }"
    >
      <a-button class="control-button" v-on:click="startPressed">Start</a-button>
      <a-button class="control-button" v-on:click="stopPressed">Stop</a-button>
    </a-card>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { RestService } from '@/service/RestService';
import { useWebSocketMessageStore } from '@/stores/WebSocketMessageStore';

let debug = false;

export default {
  computed: {
    iRestService: ()=>RestService(),
    webSocketMessageStore: ()=>useWebSocketMessageStore(),
  },
  created(){
    if (!this.webSocketMessageStore.isConnected) {
      if (debug) console.log('establish ws connection ...');
      this.webSocketMessageStore.connect();
    } else {
      this.webSocketMessageStore.ping();
      if (debug) console.log('ws clientId =', this.webSocketMessageStore.clientId);
    }
  },
  methods: {
    startPressed(){
      this.iRestService.put_luckyDraw_start();
    },
    stopPressed(){
      this.iRestService.put_luckyDraw_stop();
    },
  },
};
</script>

<style scoped>
.control-button {
  margin-right: 1em;
  margin-top: 0.4em;
}
</style>
