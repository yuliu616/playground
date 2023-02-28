<template>
  <a-card title="Tell me your thought"
    :head-style="{ 
      backgroundColor: 'royalblue',
      color: 'white',
    }">
    
    <a-form layout="inline" :wrapper-col="{ span: 24 }">
      <a-form-item label="Name" class="w100"
      v-bind:validate-status="isEditing && !personInfo.name ? 'warning':''">
        <a-input v-model="personInfo.name" 
          v-bind:read-only="!isEditing"
          placeholder="peter, john, whatever" />
      </a-form-item>
      <a-form-item label="Guess" class="w100"
      v-bind:validate-status="isEditing && !personInfo.guess ? 'warning':''">
        <a-input v-model.number="personInfo.guess"
          v-bind:read-only="!isEditing"
          placeholder="give an integer, eg. 1, 3, 16, 45." />
      </a-form-item>
      <a-form-item label="Contribution" class="w100"
      v-bind:validate-status="isEditing && !personInfo.contribution ? 'warning':''">
        <a-input v-model.number="personInfo.contribution" 
          v-bind:read-only="!isEditing"
          placeholder="how much ?" />
      </a-form-item>
    </a-form>

    <template slot="actions">
      <span v-if="!isEditing" v-on:click="onEditPressed()">
        <a-icon type="edit" /> Edit
      </span>
      <span v-if="isEditing" v-on:click="onUpdatePressed()">
        <a-icon type="edit" /> Update
      </span>
      <span v-if="isEditing" v-on:click="randomFilling()">
        <a-icon type="redo" /> Random
      </span>
      <span v-on:click="onJoinPressed()"
      v-if="!isEditing">
        <a-icon type="check" /> Join
      </span>
    </template>
    
  </a-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { RestService } from '@/service/RestService';
import { MessageService } from '@/service/MessageService';
import { StringHelper } from '../util/StringHelper';
import { rootStoreState } from '@/stores';

export default Vue.extend({
  name: 'PersonInfoPane',
  computed: {
    iRestService: ()=>RestService(),
    iMessageService: ()=>MessageService(),
  },
  data(){
    return {
      personInfo: {} as PersonInfoForm,
      isEditing: false,
    };
  },
  methods: {
    randomFilling(){
      this.personInfo = {
        name: randomValues([ 'Peter', 'Mary', 'John', 'Bob', 'Lucy', 'Jackson']),
        guess: Math.floor(Math.random() * 5)+1,
        contribution: Math.floor(Math.random() * 12)*100+400,
      };
    },
    onEditPressed(){
      this.isEditing = true;
    },
    onUpdatePressed(){
      if (this.personInfo.name && 
      this.personInfo.guess && 
      this.personInfo.contribution) 
      {
        this.isEditing = false;
      }
    },
    async onJoinPressed(){
      if (!rootStoreState.wsChannelStateStore.isConnected) {
        this.iMessageService.warn('ws is not yet connected.');
      } else {
        try {
          await this.iRestService.post_luckyDraw_join({
            body: {
              clientId: rootStoreState.wsChannelStateStore.clientId,
              name: this.personInfo.name || '',
              guess: this.personInfo.guess || 0,
              contribution: this.personInfo.contribution || 0,
            },
          });
          this.iMessageService.info("join accepted.");
        } catch (err) {
          this.iMessageService.errorMsg(err, 'update error');
        }
      }
    },
  }
});

interface PersonInfoForm {
  name?: string;
  guess?: number;
  contribution?: number;
}

function randomValues<T>(values: T[]): T{
  let i = Math.floor(Math.random() * values.length);
  return values[i];
}
</script>
