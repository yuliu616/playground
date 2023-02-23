<template>
  <a-card title="Tell me your thought"
    :head-style="{ 
      backgroundColor: 'royalblue',
      color: 'white',
    }">
    
    <a-form layout="inline" :wrapper-col="{ span: 24 }">
      <a-form-item label="Name" class="w100">
        <a-input v-model="personInfo.name" 
          placeholder="peter, john, whatever" />
      </a-form-item>
      <a-form-item label="Guess" class="w100">
        <a-input v-model="personInfo.guess" 
          placeholder="give an integer, eg. 1, 3, 16, 45." />
      </a-form-item>
      <a-form-item label="Contribution" class="w100">
        <a-input v-model="personInfo.contribution" 
          placeholder="how much ?" />
      </a-form-item>
    </a-form>

    <template slot="actions">
      <span v-on:click="onEditPressed()">
        <a-icon type="edit" /> Edit
      </span>
      <span v-on:click="onDonePressed()">
        <a-icon type="check" /> Done
      </span>
    </template>
    
  </a-card>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'PersonInfoPane',
  data(){
    return {
      personInfo: {
        name: null,
        guess: null,
        contribution: null,
      },
    };
  },
  methods: {
    onEditPressed(){
      console.log('onEditPressed');
    },
    onDonePressed(){
      console.log('onDonePressed');
    }
  }
});
</script>
