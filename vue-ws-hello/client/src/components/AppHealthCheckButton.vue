<template>
  <a-card title="About"
    :head-style="{ 
      backgroundColor: 'royalblue',
      color: 'white',
    }">
    <a-button @click="submitHealthCheck()">Health-check</a-button>
  </a-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { RestService } from '@/service/RestService';
import { WSChannelService } from '@/service/WSChannelService';
import { MessageService } from '@/service/MessageService';
import { StringHelper } from '../util/StringHelper';
import { rootStoreState } from '@/stores';

export default Vue.extend({
  name: 'AppHealthCheckButton',
  computed: {
    iRestService: ()=>RestService(),
    iWSChannelService: ()=>WSChannelService(),
    iMessageService: ()=>MessageService(),
  },
  methods: {
    async submitHealthCheck(){
      let res = await this.iRestService.get_version()
      .catch(err=>{
        this.iMessageService.errorMsg(err, 'dataLoadingError');
        throw err;
      });
      console.log('health-check response payload:', res);
      await this.iMessageService.info(StringHelper.formatString(
        "got health-check response: service=[{0}] version=[{1}] instance=[{2}]", 
        res.serviceName, res.apiVersion, res.instanceRandId));

      if (!rootStoreState.wsChannelStateStore.isConnected){
        this.iWSChannelService.connect();
      } else {
        this.iWSChannelService.ping();
      }
    },
  },
});
</script>
