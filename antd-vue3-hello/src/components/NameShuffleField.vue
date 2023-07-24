<template>
  <div class="nameField">
    <div @wheel="doShuffle()">{{ personName }}</div>
  </div>
</template>

<script lang="ts">
let onModelValueChangeCallback = (_: string)=>{};

export default {
  emits: ['update:personName'],
  props: {
    personName: String,
  },
  setup(props, ctx) {
    onModelValueChangeCallback = 
      (s: string)=>ctx.emit('update:personName', s);
  },
  methods: {
    doShuffle(){
      let rand = Math.random();
      let answer: string;
      if (rand < 0.2) {
        answer = 'Peter';
      } else if (rand < 0.4) {
        answer = 'John';
      } else if (rand < 0.45) {
        answer = 'David';
      } else if (rand < 0.6) {
        answer = 'Mary';
      } else if (rand < 0.9) {
        answer = 'Rose';
      } else {
        answer = 'Donald';
      }
      onModelValueChangeCallback(answer);
    },
  },
};
</script>

<style scoped>
div.nameField {
  border: 3px dashed red;
  border-radius: 8px;
  background-color: pale;
  padding: 6px 12px;
}

div.view-wrapper.dark div.nameField {
  color: white;
}
</style>
