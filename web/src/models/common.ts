export default {
  namespace: 'common',
  state: {
    network: 0,
    web3: null,
    walletAddress: '',
    walletType: '',
    DFSupply: 0,
    dfBalance: 0,
    actionStatus: 'pending',  // pending, failure, success
    actionVisible: false,
    actionTransactionHash: '',
  },
  reducers: {
    updateParams(state, action) {
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    },
    updateMultiParams(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    updateTransAction(state, action) {
      return {
        ...state,
        actionStatus: action.payload.actionStatus,
        actionVisible: action.payload.actionVisible,
        actionTransactionHash: action.payload.actionTransactionHash,
      };
    },
  }
}
