import { defineStore } from "pinia";

export interface MessageStoreState {
  messageList: string[];
  count: number;
  isEmpty: boolean;
}

let useMessageStore = defineStore('Message', {
  state: ()=><MessageStoreState>({
    messageList: <string[]>[],
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
