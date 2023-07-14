let debug = false;

export const wsChannelStateStore = {
  namespaced: true,
  state: <WSChannelState>{
    isConnected: false,
  },
  mutations: {
    changeConnectionState(state: WSChannelState, 
      value: boolean)
    {
      if (state.isConnected != value) {
        state.isConnected = value;
        if (debug) console.log(`state.isConnected changed to`, state.isConnected);
      } else {
        if (debug) console.log(`state.isConnected intact and it is`, state.isConnected);
      }
    },
    changeClientId(state: WSChannelState, clientId: number)
    {
      state.clientId = clientId;
    },
  },
};

export interface WSChannelState {
  isConnected: boolean;
  clientId: number;
}
