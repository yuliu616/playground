import { defineStore } from "pinia";
import { ref, type Ref } from 'vue';

export interface MessageStoreState {
  messageList: Ref<string[]>;
  // count: Ref<number>;
  // isEmpty: Ref<boolean>;
}

let useMessageStore = defineStore('Message', {
  state: ()=><MessageStoreState>({
    messageList: ref([]),
  }),
  getters: {
    count: (state)=>state.messageList.length,
    isEmpty: (state)=>(state.messageList.length==0),
  },
  actions: {
    addMessage(msg: string){
      this.messageList.push(msg);
    },
    removeMessage(index: number){
      this.messageList.splice(index, 1);
    },
    clear(){
      this.messageList.splice(0);
    },
  },
});

export { useMessageStore };
