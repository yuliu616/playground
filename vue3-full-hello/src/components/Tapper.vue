<template>
  <div>
    <div class="button" @click="onClicked()">
      {{ caption }} {{ counter }}
    </div>
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

<style scoped>
.button {
  display: inline-block;
  border-radius: 8%;
  padding: 0.4rem 0.8rem;
  margin-left: 0.8em;
  
  background-color: #ffffff;
  color: #000000;
  transition: 0.2s;

  cursor: pointer;
}

.button:hover {
  background-color: #777777;
  color: #ffffff;
}
</style>
