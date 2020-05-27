export default {
  namespace: 'governance',
  state: {
    modalVisible: false
  },
  reducers: {
    updateModalVisible(state, action) {
      return {
        ...state,
        modalVisible: !!action.payload
      };
    },
  }
}
