<template>
  <div>
    <h1>This is an about page {{ t1 }}</h1>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';

export default {
  data(){
    return {
      t1: ref('T for tour'),
    };
  },
  setup(props, ctx) {
  },
  beforeCreate() {
  },
  created() {
  },
  beforeMount() {
  },
  mounted() {
  },
  beforeUnmount() {
  },
  unmounted() {
  },
};
</script>
