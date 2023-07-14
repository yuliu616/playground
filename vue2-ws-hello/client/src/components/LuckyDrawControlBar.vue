<template>
  <a-card title="LuckyDrawControlBar"
    :head-style="{ 
      backgroundColor: 'royalblue',
      color: 'white',
    }">
    <a-button class="control-button" v-on:click="startPressed">Start</a-button>
    <a-button class="control-button" v-on:click="stopPressed">Stop</a-button>
  </a-card>
</template>

<style scoped>
.control-button {
  margin-right: 1em;
  margin-top: 0.4em;
}
</style>

<script lang="ts">
import Vue from 'vue';
import { RestService } from '@/service/RestService';
import { WSChannelService } from '@/service/WSChannelService';
import { rootStoreState } from '@/stores';

let debug = false;

export default Vue.extend({
  name: 'LuckyDrawControlBar',
  computed: {
    iRestService: ()=>RestService(),
    iWSChannelService: ()=>WSChannelService(),
  },
  created(){
    if (!rootStoreState.wsChannelStateStore.isConnected){
      if (debug) console.log('establish ws connection ...');
      this.iWSChannelService.connect();
    } else {
      this.iWSChannelService.ping();
      if (debug) console.log('ws clientId =', rootStoreState.wsChannelStateStore.clientId);
    }
  },
  methods: {
    startPressed(){
      this.iRestService.put_luckyDraw_start();
    },
    stopPressed(){
      this.iRestService.put_luckyDraw_stop();
    },
  }
});
</script>
