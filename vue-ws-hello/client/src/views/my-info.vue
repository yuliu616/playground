<template>
  <div class="my cards">
    <lucky-draw-control-bar></lucky-draw-control-bar>
    <person-info-pane></person-info-pane>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import LuckyDrawControlBar from '@/components/LuckyDrawControlBar.vue';
import PersonInfoPane from '@/components/PersonInfoPane.vue';

export default Vue.extend({
  components: { 
    LuckyDrawControlBar,
    PersonInfoPane,
  },
  name: 'my-info',
});
</script>
