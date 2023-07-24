<template>
  <header class="menu-bar">
    <a-menu mode="horizontal">
      <a-menu-item key="home">
        <RouterLink to="/">Home</RouterLink>
      </a-menu-item>
      <a-menu-item key="myinfo">
        <RouterLink to="/my-info">My Info</RouterLink>
      </a-menu-item>
    </a-menu>
  </header>

  <div class="body-pane">
    <a-config-provider :locale="locale">
      <RouterView />
    </a-config-provider>
  </div>
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
.menu-bar {
  margin: 0;
  padding: 0;
}

.body-pane {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2em;
}
</style>
