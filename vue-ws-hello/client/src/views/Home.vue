<template>
  <div class="my cards">
    <app-health-check-button></app-health-check-button>
    <draw-monitor-pane></draw-monitor-pane>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import AppHealthCheckButton from '@/components/AppHealthCheckButton.vue';
import DrawMonitorPane from '@/components/DrawMonitorPane.vue';

export default Vue.extend({
  components: { 
    AppHealthCheckButton,
    DrawMonitorPane,
  },
  name: 'Home',
});
</script>
