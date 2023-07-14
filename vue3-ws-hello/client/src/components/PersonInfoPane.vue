<template>
  <div class="my card">
    <a-card title="Tell me your thought"
    :head-style="{ 
      backgroundColor: 'royalblue',
      color: 'white',
    }">
      <a-form layout="horizontal"
        :label-col="{ span: 24 }"
        :wrapper-col="{ span: 24 }"
      >
        <a-form-item label="Name"
          :validate-status="(isEditing && !personInfo.name ? 'warning':'')"
        >
          <a-input v-model:value="personInfo.name"
            :readonly="!isEditing"
            placeholder="peter, john, whatever" 
          />
        </a-form-item>
        <a-form-item label="Guess"
          :validate-status="(isEditing && typeof personInfo.guess != 'number' ? 'warning':'')"
        >
          <a-input-number v-model:value="personInfo.guess"
            class="my ant input-number"
            :readonly="!isEditing"
            :min="1" :max="100"
            placeholder="give an integer, eg. 1, 3, 16, 45." 
          />
        </a-form-item>
        <a-form-item label="Contribution"
          :validate-status="(isEditing && typeof personInfo.contribution != 'number' ? 'warning':'')"
        >
          <a-input-number v-model:value="personInfo.contribution"
            class="my ant input-number"
            :readonly="!isEditing"
            :min="0"
            placeholder="how much ?" 
          />
        </a-form-item>
      </a-form>

      <template #actions>
        <div v-if="!isEditing" @click="onEditPressed">
          <EditOutlined /> Edit
        </div>
        <div v-if="isEditing" @click="onUpdatePressed">
          <EditFilled /> Update
        </div>
        <div v-if="isEditing" @click="randomFilling">
          <RedoOutlined /> Random
        </div>
        <div v-if="!isEditing" @click="onJoinPressed">
          <CheckOutlined /> Join
        </div>
      </template>
    </a-card>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { RestService } from '@/service/RestService';
import { MessageService } from '@/service/MessageService';
import { useWebSocketMessageStore } from '@/stores/WebSocketMessageStore';
import {
  EditOutlined, EditFilled, CheckOutlined, RedoOutlined,
} from '@ant-design/icons-vue/lib/icons';

let debug = false;

export default {
  components: { EditOutlined, EditFilled, CheckOutlined, RedoOutlined, },
  data(){
    return {
      personInfo: {} as PersonInfoForm,
      isEditing: ref(false),
    };
  },
  computed: {
    iRestService: ()=>RestService(),
    iMessageService: ()=>MessageService(),
    webSocketMessageStore: ()=>useWebSocketMessageStore(),
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
        if (debug) console.log('form saved:', this.personInfo);
        this.isEditing = false;
      } else {
        if (debug) console.log('form rejected:', this.personInfo);
      }
    },
    async onJoinPressed(){
      if (!this.webSocketMessageStore.isConnected) {
        this.iMessageService.warn('ws is not yet connected.');
      } else {
        try {
          let form = {
            clientId: this.webSocketMessageStore.clientId!,
            name: this.personInfo.name || '',
            guess: this.personInfo.guess || 0,
            contribution: this.personInfo.contribution || 0,
          };
          if (debug) console.log('post_luckyDraw_join with form:', form);
          await this.iRestService.post_luckyDraw_join({
            body: form,
          });
          this.iMessageService.info("join accepted.");
        } catch (err) {
          this.iMessageService.errorMsg(err, 'update error');
        }
      }
    },
  },
};

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
