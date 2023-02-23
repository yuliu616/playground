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
        console.log(`state.isConnected changed to`, state.isConnected);
      } else {
        console.log(`state.isConnected intact and it is`, state.isConnected);
      }
    },
  },
};

export interface WSChannelState {
  isConnected: boolean;
}
