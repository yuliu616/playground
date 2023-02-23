<template>
  <a-card title="LuckyDrawControlBar"
    :head-style="{ 
      backgroundColor: 'royalblue',
      color: 'white',
    }">
    <a-button class="control-button" v-on:click="startPressed">Start</a-button>
    <a-button class="control-button" v-on:click="stopPressed">Stop</a-button>
    <a-button class="control-button" v-on:click="restartPressed">Restart</a-button>
    <a-button class="control-button" v-on:click="joinPressed">Join</a-button>
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

export default Vue.extend({
  name: 'LuckyDrawControlBar',
  methods: {
    startPressed(){
      console.log('startPressed');
    },
    stopPressed(){
      console.log('stopPressed');
    },
    restartPressed(){
      console.log('restartPressed');
    },
    joinPressed(){
      console.log('joinPressed');
    },
  }
});
</script>
