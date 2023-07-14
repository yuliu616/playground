import Vue from 'vue';
import Vuex from 'vuex';

import { wsChannelStateStore, WSChannelState } from './wsChannelStateStore';

Vue.use(Vuex);

let rootStore = new Vuex.Store({
  modules: {
    wsChannelStateStore: <any> wsChannelStateStore,
  }
});

export { rootStore };

export interface RootStoreState {
  wsChannelStateStore: WSChannelState; 
}

const rootStoreState: RootStoreState = <RootStoreState>rootStore.state;
export { rootStoreState };
