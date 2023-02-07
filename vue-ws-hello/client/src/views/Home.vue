<template>
  <div>
    <a-alert message="hello" 
      description="demo"
      type="info" show-icon />
    <app-health-check-button></app-health-check-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import AppHealthCheckButton from '@/components/AppHealthCheckButton.vue';

export default Vue.extend({
  components: { AppHealthCheckButton },
  name: 'Home',
});
</script>
