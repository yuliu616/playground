<template>
  <main>
    <p>
      <img 
        alt="Vue logo" src="@/assets/logo.svg" 
        width="125" height="125"
        class="home-logo" 
        :style="{ backgroundColor: homeLogoBGColor }"
       />
    </p>
    <TheWelcome />
    <Tapper caption="hehe" v-bind:initValue="2" />
  </main>
</template>

<script setup lang="ts">
import Tapper from '@/components/Tapper.vue';
import TheWelcome from '../components/TheWelcome.vue';

let homeLogoBGColor = import.meta.env.VITE_LOGO_BG_COLOR;
</script>
