import { defineStore } from "pinia";

const WS_URL_PROTOCL = "ws://";
const WS_BASE_URL = '/ws/1.0/luckyDrawChannel';
// const WS_URL = 'ws://localhost:8888/ws/1.0/luckyDrawChannel';

type WS_MSG_LISTENER =  (message: WsMessage)=>void;

export interface WebSocketMessageStore {
  debug: boolean;
  ws: WebSocket|null;
  isConnected: boolean;
  clientId?: number;
  messageListenerList: WS_MSG_LISTENER[];
}

let useWebSocketMessageStore = defineStore('webSocketMessage', {
  state: ()=><WebSocketMessageStore>({
    debug: true, // TODO
    ws: null,
    isConnected: false,
    messageListenerList: [],
  }),
  actions: {
    changeConnectionState(value: boolean){
      if (this.isConnected != value) {
        this.isConnected = value;
        this.logDebug(`state.isConnected changed to`, this.isConnected);
      } else {
        this.logDebug(`state.isConnected intact and it is`, this.isConnected);
      }
    },
    connect(): void {
      if (this.ws == null) {
        // let url = WS_URL;
        let url = WS_URL_PROTOCL + window.location.host + WS_BASE_URL;
        if (this.debug) console.log('connect to url:', url);
        let ws = new WebSocket(url);
        ws.onerror = (ev)=>this.onError(ev);
        ws.onmessage = (ev)=>this.onMessage(ev);
        ws.onclose = (ev)=>this.onClose(ev);
        ws.onopen = (ev)=>this.onOpen(ev);  
        this.ws = ws;
      }
      
      this.changeConnectionState(false);
    },
    onError(event: Event){
      if (event.target) {
        let errorWs = <WebSocket>event.target;
        console.error('ws error, url =', errorWs.url, ', readyState =', errorWs.readyState);  
      } else {
        console.error('ws error.');
      }
    },
    onOpen(event: Event){
      this.logDebug('ws onOpen', event.type);
      this.changeConnectionState(true);
    },
    onClose(event: CloseEvent){
      this.logDebug('ws onClose', event.type);
      this.changeConnectionState(false);
    },
    onMessage(event: MessageEvent){
      let message: WsMessage|null = null;
      if ((<string>event.data).startsWith('{')) {
        message = JSON.parse(<string>event.data);
      }
      if (message?.type){
        if (message?.type == WsMessageType.INIT) {
          this.logDebug('ws INIT onMessage', message.data);
          this.clientId = message.data;
          this.logDebug('WebSocketMessageStore.clientId =', this.clientId);
        }
        for (let listener of this.messageListenerList) {
          listener(message);
        }
      } else {
        console.log('ws onMessage', event.data);
      }
    },
    ping(): void {
      if (!this.isConnected) {
        throw new Error('connection not yet made.');
      } else {
        this.ws?.send('just to serve a ping.');
      }
    },
    listenToMessage(listener:(message: WsMessage)=>void){
      this.logDebug('adding listener.');
      this.messageListenerList.push(listener);
    },
    stopListening(listener:(message: WsMessage)=>void){
      let found = this.messageListenerList.indexOf(listener);
      this.logDebug(`removing listener, found.index=${found}.`);
      this.messageListenerList.splice(found, 1)
    },
    logDebug(text: string, ... args: any[]){
      if (this.debug) console.log(text, ...args);
    },
  },
});

export enum WsMessageType {
  'INIT' = 'INIT',
  'ANNOUNCEMENT'= 'ANNOUNCEMENT',
  'DRAW_START' = 'DRAW_START',
  'DRAW_RESULT' = 'DRAW_RESULT',
  'DRAW_END' = 'DRAW_END',
}

export interface WsMessage {
  type: WsMessageType,
  text?: string,
  data?: any,
}

export { useWebSocketMessageStore };
