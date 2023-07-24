<template>
  <header>
    <MenuBar />
  </header>

  <a-config-provider :locale="locale">
    <div :class="{ dark: darkTheme, light: !darkTheme, }"
      class="view-wrapper"
    >
      <RouterView />
    </div>
    <PageFooter />
  </a-config-provider>
</template>

<script lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import PageFooter from '@/components/PageFooter.vue';
import MenuBar from './components/MenuBar.vue';
import { NativeDomUtil } from './util/NativeDomUtil';
import en_US from 'ant-design-vue/es/locale/en_US';
import zh_CN from 'ant-design-vue/es/locale/zh_CN';
// import ja_JP from 'ant-design-vue/es/locale/ja_JP';
import { ref } from 'vue';
import type { ILogger } from './model/core/ILogger';

const logger: ILogger = console;

// note that, these color should match with main.css
const COLOR_PALETTE = {
  DARK_FG_COLOR: '#f0f0f0',
  DARK_BG_COLOR: '#303030',
  LIGHT_FG_COLOR: 'black',
  LIGHT_BG_COLOR: 'whitesmoke',  
};

export default {
  components: {
    RouterLink,
    RouterView,
    MenuBar,
    PageFooter,
  },
  computed: {
    darkTheme: ()=>!!(+import.meta.env.VITE_DarkTheme),
  },
  data() {
    return {
      locale: en_US,
      // locale: zh_CN,
      // locale: ja_JP,
    };
  },
  mounted() {
    NativeDomUtil.changeBodyForeBackColor(
      this.darkTheme ? COLOR_PALETTE.DARK_FG_COLOR : COLOR_PALETTE.LIGHT_FG_COLOR,
      this.darkTheme ? COLOR_PALETTE.DARK_BG_COLOR : COLOR_PALETTE.LIGHT_BG_COLOR,
    );
  },
};
</script>

<style scoped>
div.view-wrapper {
  padding: 2em;
  width: 100%;
  height: fit-content;
}
</style>
