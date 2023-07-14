<template>
  <div id="app">
    <div v-bind:style="{ backgroundColor: logoBgColor }">
      <img class="logo" alt="logo" v-if="runMode=='production'" src="./assets/logo.png">
      <img class="logo" alt="logo" v-if="runMode=='development'" src="./assets/logo-dev.png">
    </div>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  data(){
    return {
      runMode: process.env.NODE_ENV,
      logoBgColor: process.env.VUE_APP_LOGO_BG_COLOR,
    };
  },
};
</script>

<style scoped>
#nav {
  padding: 30px;
  text-align: center;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

img.logo {
  width: 8em;
  height: 8em;
}
</style>
