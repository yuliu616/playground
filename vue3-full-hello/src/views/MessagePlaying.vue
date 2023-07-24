<template>
  <div>
    <h2>Message Playing View</h2>
    <div class="messageList">
      
      <div class="header">
        <h3>message list</h3>
        <span v-if="isEmptyList">
          (empty)
        </span>
        <span v-if="!isEmptyList">
          (count: {{ messageCount }})
        </span>
      </div>

      <div class="item" v-for="counter in messageCount">
        - {{ getItem(counter-1) }}
        <button class="crossing-item"
          @click="deleteItem(counter-1)">x</button>
      </div>

      <div class="footer">
        <div>
          draft:
        </div>
        <textarea class="messageDraft" 
          v-model="draftMessage"
        ></textarea>
        <div>
          <button @click="add">add</button>
          <button @click="addJunk(10)">add junk</button>
          <button @click="addNews(20)">add news(CORS)</button>
          <button @click="clear">clear</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { useMessageStore } from '@/stores/MessageStore';
import { ref } from 'vue';

// based on JSON data structure of weibo
interface NewsStructure {
  ok: number;
  data: {
    realtime: NewsItem[];
    hotgovs: NewsItem[];
    hotgov: NewsItem;
  };
}

interface NewsItem {
  onboard_time: number;
  category: string;
  note: string;
  icon_desc: string;
  icon_desc_color: string;
}

export default {
  data() {
    return {
      list: <string[]>[],
      draftMessage: ref(''),
    };
  },
  computed: {
    MessageStore: ()=>useMessageStore(),
    isEmptyList() {
      return this.MessageStore.isEmpty;
    },
    messageCount() {
      return this.MessageStore.count;
    },
  },
  mounted(){
    this.MessageStore.$subscribe((mutation, state)=>{
      console.log('messageStore is changing.', 
        state.messageList);
    }, {
      // detach means wont release along with 
      // the component unmount
      detached: false,
    });
  },
  methods: {
    getItem(index: number){
      return this.MessageStore.messageList[index];
    },
    add(){
      if (this.draftMessage.length > 0) {
        this.MessageStore.addMessage(this.draftMessage);
        this.draftMessage = '';
      }
    },
    addJunk(count: number){
      for (let i=0;i<count;i++) {
        this.MessageStore.addMessage(`junkie message ${Math.random()}.`);
      }
    },
    async addNews(count: number){
      try {
        let res = await fetch('https://weibo.com/ajax/side/hotSearch');
        let parsed = <NewsStructure> await res.json();
        console.log('parsed =', parsed);
        if (parsed.data.realtime.length < count) {
          count = parsed.data.realtime.length;
        }
        for (let i=0;i<count;i++) {
          this.MessageStore.addMessage(parsed.data.realtime[i].note);
        }
      } catch (err) {
        console.error('if it is a CORS error, please try again with browser CORS disabled.');
        console.error(err);
      }
    },
    deleteItem(index: number) {
      this.MessageStore.removeMessage(index);
    },
    clear(){
      this.MessageStore.clear();
    },
  },
};
</script>

<style scoped>
.messageList {
  border: 4px solid snow;
  border-radius: 12px;
  margin: 0.4em;
  padding: 0.4em;
}

.item {
  border: 2px solid darkcyan;
  border-radius: 8px;
  margin: 0.12em;
  padding: 0.2em;
}

.crossing-item {
  border-radius: 45%;
  background-color: rgba(177, 177, 177, 0.5);
  color: white;
}

.messageDraft {
  min-height: 2 em;
}
</style>
