<script setup lang="ts">
import Tapper from '@/components/Tapper.vue';
import TheWelcome from '../components/TheWelcome.vue';

function gotTen(){
  console.log('Home got ten');
}
</script>

<template>
  <main>
    <TheWelcome />
    <Tapper caption="hehe" v-bind:initValue="2" />
  </main>
</template>
