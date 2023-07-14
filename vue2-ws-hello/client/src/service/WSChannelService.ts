import { Store } from 'vuex';
import { rootStore, rootStoreState } from "@/stores";

const DEFAULT_WS_BASE_URL = '/ws/1.0/luckyDrawChannel';
const DEFAULT_ROOT_STORE = rootStore;

type WS_MSG_LISTENER =  (message: WsMessage)=>void;

export class WSChannelServiceImpl {

  debug: boolean = false;
  
  wsBaseUrl: string;
  messageListenerList: WS_MSG_LISTENER[] = [];

  private ws?: WebSocket;
  private rootStore: Store<any>;
  
  constructor(rootStore: Store<any> = DEFAULT_ROOT_STORE, 
    wsBaseUrl: string = DEFAULT_WS_BASE_URL)
  {
    this.rootStore = rootStore;
    this.wsBaseUrl = wsBaseUrl;
    console.log('new WSChannelServiceImpl instance created');
  }

  connect(): void {
    let url = `ws://${window.location.host}${this.wsBaseUrl}`;
    this.ws = new WebSocket(url);
    this.rootStore.commit('wsChannelStateStore/changeConnectionState', false);
    this.ws.onerror = (ev)=>this.onError(ev);
    this.ws.onmessage = (ev)=>this.onMessage(ev);
    this.ws.onclose = (ev)=>this.onClose(ev);
    this.ws.onopen = (ev)=>this.onOpen(ev);
  }

  private onError(event: Event){
    if (event.target) {
      let errorWs = <WebSocket>event.target;
      console.error('ws error, url =', errorWs.url, ', readyState =', errorWs.readyState);  
    } else {
      console.error('ws error.');
    }
  }

  private onOpen(event: Event){
    if (this.debug) console.log('ws onOpen', event.type);
    this.rootStore.commit('wsChannelStateStore/changeConnectionState', true);
    // console.log('ws.store.isConnected =', rootStoreState.wsChannelStateStore.isConnected);
  }

  private onClose(event: CloseEvent){
    if (this.debug) console.log('ws onClose', event.type);
    this.rootStore.commit('wsChannelStateStore/changeConnectionState', false);
    // console.log('ws.store.isConnected =', rootStoreState.wsChannelStateStore.isConnected);
  }

  private onMessage(event: MessageEvent){
    let message: WsMessage|null = null;
    if ((<string>event.data).startsWith('{')) {
      message = JSON.parse(<string>event.data);
    }
    if (message?.type){
      if (message?.type == WsMessageType.INIT) {
        if (this.debug) console.log('ws INIT onMessage', message.data);
        rootStore.commit('wsChannelStateStore/changeClientId', message.data);
      }
      for (let listener of this.messageListenerList) {
        listener(message);
      }
    } else {
      console.log('ws onMessage', event.data);
    }
  }

  public ping(): void {
    if (!rootStoreState.wsChannelStateStore.isConnected) {
      throw new Error('connection not yet made.');
    } else {
      this.ws?.send('just to serve a ping.');
    }
  }

  public listenToMessage(listener:(message: WsMessage)=>void){
    this.messageListenerList.push(listener);
  }

  public stopListening(listener:(message: WsMessage)=>void){
    let found = this.messageListenerList.indexOf(listener);
    this.messageListenerList.splice(found, 1)
  }

}

let Singleton: WSChannelServiceImpl;

export function WSChannelService(debug = false): WSChannelServiceImpl 
{
  if (!Singleton) {
    Singleton = new WSChannelServiceImpl();
    console.log('create new instance WSChannelService');
  }
  Singleton.debug = debug;
  return Singleton;
}

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
