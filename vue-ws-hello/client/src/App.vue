<template>
<a-config-provider :locale="antdLocale">
  <div>
    <div class="menuBar">
      <router-link to="/">
        <div class="menuItem">Home</div>
      </router-link>
      <router-link to="/my-info">
        <div class="menuItem">My Info</div>
      </router-link>
    </div>
    <div class="body-pane">
      <transition name="faded-slide">
        <router-view class="view-wrapper" />
      </transition>
    </div>
  </div>
</a-config-provider>
</template>

<script lang="ts">
import Vue from 'vue';
import { LocaleCode, getAntdLocale } from '@/model/Locale';

export default Vue.extend({
  data(): ViewStateModel {
    return {
      locale: LocaleCode.en,
    };
  },
  computed: {
    antdLocale(): any {
      return getAntdLocale(this.locale);
    },
  },
  methods: {
  },
});

interface ViewStateModel {
  locale: LocaleCode,
}
</script>

<style scoped>
div.menuBar {
  display: block;
  width: 100%;
  height: 3em;
  padding: 0.6em 1.4em 0.4em 1.4em;
  background-color: black;
  color: white;
}
div.menuItem {
  display: inline-block;
  border: 1px white solid;
  padding: 0.2em 1.4em 0.2em 1.4em;
  min-width: 6em;
  text-align: center;
  background-color: black;
  color: white;
}
div.menuItem:hover {
  background-color: #404040;
  color: white;
}

div.body-pane {
  margin: 1.8em;
}
</style>

<style>
div.ant-card {
  margin-bottom: 0.8em;
}
</style>