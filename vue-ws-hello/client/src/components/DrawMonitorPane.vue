<template>
  <a-card title="DrawMonitorPane" class="draw-monitor-pane w100"
    :head-style="{ 
      backgroundColor: 'royalblue',
      color: 'white',
    }"
    :body-style="{ padding: '0.8em' }">
    <div class="draw-monitor-item"
    v-for="it in ticketLogList" v-bind:key="it.ticket">
      <span class='my teal circular label'>
        {{ it.ticket }}
      </span>
    </div>
    <div class="draw-monitor-item">
      <span class='my orange circular label'>
        {{ wonByTicket }}
      </span>
      <span class="my orange label">
        <i class="trophy icon"></i>
        {{ personWon }}
      </span>
    </div>
  </a-card>
</template>

<style scoped>
div.draw-monitor-item {
  display: inline-block;
  margin-left: 0;
  margin-right: 0.6em;
  height: 2.2em;
}
</style>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'DrawMonitorPane',
  data() {
    return {
      personWon: 'John Ma',
      wonByTicket: '#36',
      ticketLogList: [
        { ticket: '#3' },
        { ticket: '#67' },
        { ticket: '#24' },
        { ticket: '#23' },
        { ticket: '#34' },
        { ticket: '#36' },
      ]
    }
  },
});
</script>
