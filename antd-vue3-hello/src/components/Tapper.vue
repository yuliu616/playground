<template>
  <div>
    <a-button class="my antd-btn" ghost
      @click="onClicked()"
    >
      {{ caption }} {{ counter }}
    </a-button>
    <TheWelcome />
  </div>
</template>

<script lang="ts">
import { ref, watch, type WatchStopHandle } from 'vue';
import TheWelcome from '@/components/TheWelcome.vue';

let viewModel = {
  counter: ref(0),
}

let unwatcherForCounter: WatchStopHandle|null = null;

export default {
  props: {
    caption: String,
    initValue: { type: Number, required: false },
  },
  data: ()=>viewModel,
  components: {
    TheWelcome,
  },
  mounted(){
    viewModel.counter.value = this.initValue || 0;

    unwatcherForCounter = watch(viewModel.counter, (value, prev)=>{
      if ((value || 0) >= 10 &&
        (prev || 0) < 10)
      {
        console.log('its really big');
      // } else {
      //   console.log('value =', value, ' prev =', prev);
      }
    });
  },
  beforeUnmount() {
      // normally, watch will be deleted automatically 
      // along its view
      if (unwatcherForCounter) {
        console.log('unwatching.');
        unwatcherForCounter();
      }
  },
  methods: {
    onClicked(){
      this.counter = (this.counter || 10) + 1;
    },
  }
};
</script>
