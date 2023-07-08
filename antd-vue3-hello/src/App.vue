<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/form1">Form</RouterLink>
        <RouterLink to="/message">Message</RouterLink>
      </nav>
    </div>
  </header>

  <a-config-provider :locale="locale">
    <RouterView />
  </a-config-provider>
</template>

<script lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import en_US from 'ant-design-vue/es/locale/en_US';
// import zh_CN from 'ant-design-vue/es/locale/zh_CN';
// import ja_JP from 'ant-design-vue/es/locale/ja_JP';

export default {
  components: {
    RouterLink, 
    RouterView,
  },
  data() {
    return {
      locale: en_US,
      // locale: zh_CN,
      // locale: ja_JP,
    };
  },
};
</script>

<style scoped>
.logo {
  display: block;
  background-color: rgba(0,0,0, 0.25);
  margin: 0 auto 2rem;
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
  padding: 0 1rem;
  border-left: 1px solid rgba(235, 235, 235, 0.64);
  
}
nav a:first-of-type {
  /* cancel border adding for the first item */
  border: 0;
}
</style>
