export default {
  namespace: 'common',
  state: {
    network: 0,
    web3: null,
    walletAddress: '',
    walletType: '',
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
  }
}
