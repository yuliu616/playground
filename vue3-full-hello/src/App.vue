<script setup lang="ts">
import { computed } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
import { RouterLink, RouterView } from 'vue-router';

let favorColor = import.meta.env.VITE_FAVOR_COLOR;
let logoBorderThick = import.meta.env.VITE_LOGO_BORDER_THICK;

let logoBorder = computed(()=>{
  return `${logoBorderThick}px solid ${favorColor}`;
});
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo"
      src="@/assets/logo.svg" width="125" height="125"
      :style="{ border: logoBorder }"
    />

    <div class="wrapper">
      <HelloWorld msg="Nice, you did it!" />
      
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/form1">Form</RouterLink>
        <RouterLink to="/message">Message</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
.logo {
  display: block;
  background-color: rgba(0,0,0, 0.25);
  margin: 0 auto 2em;
}

a {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}
a:hover {
  background-color: hsla(160, 100%, 37%, 0.2);
}

/* route-link that point to current view */
nav a.router-link-exact-active {
  color: white;
  text-decoration: underline;
}
nav a.router-link-exact-active:hover {
  /* cancel style of default anchor */
  background-color: transparent;
}

/* default style of router-link */
nav a {
  display: inline-block;
  padding: 0 1em;
  border-left: 1px solid rgba(235, 235, 235, 0.64);
  
}
nav a:first-of-type {
  /* cancel border adding for the first item */
  border: 0;
}
</style>
