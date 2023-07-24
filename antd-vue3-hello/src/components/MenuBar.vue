<template>
  <a-menu mode="horizontal" class="my app-menu-bar"
    :theme="(darkTheme ? 'dark':'light')"
  >
    <a-menu-item key="home">
      <RouterLink to="/">Home</RouterLink>
    </a-menu-item>
    <a-menu-item key="about">
      <RouterLink to="/about">About</RouterLink>
    </a-menu-item>
    <a-menu-item key="form1">
      <RouterLink to="/form1">Form</RouterLink>
    </a-menu-item>
    <a-menu-item key="message">
      <RouterLink to="/message">Message</RouterLink>
    </a-menu-item>

  </a-menu>
</template>

<script lang="ts">
import { RouterLink } from 'vue-router';
import { ref } from 'vue';

export default {
  components: {
    RouterLink,
  },
  computed: {
    darkTheme: ()=>!!(+import.meta.env.VITE_DarkTheme),
  },
};
</script>