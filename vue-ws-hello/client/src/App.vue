<template>
<a-config-provider :locale="antdLocale">
  <div class="body-pane">
    <transition name="faded-slide">
      <router-view class="view-wrapper" />
    </transition>
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
div.body-pane {
  margin: 4px;
}
</style>