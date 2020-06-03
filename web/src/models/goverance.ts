import { getVoteList, getVoteDetail } from '@services/api';

export default {
  namespace: 'governance',
  state: {
    modalVisible: false,
    voteDetailData: {},
    startTime: 0,
    endTime: 0,
    optionCount: 0,
    totalVote: [],
    voteRecord: 0,
    isAlive: false,
    btnLoading: false,
    voteListData: [],
    dfBalance: 0,
  },
  effects: {
    *fetchVoteList({ payload }, { call, put }) {
      const response = yield call(getVoteList, payload);
      if (response && response.length) {
        yield put({
          type: 'updateVoteListData',
          payload: response,
        });
      }
    },

    *fetchVoteDetail({ payload, callback }, { call, put }) {
      const response = yield call(getVoteDetail, payload);

      if (response && response.contract_address) {
        yield put({
          type: 'updateVoteDetailData',
          payload: response,
        });

        callback && callback();
      }
    }
  },
  reducers: {
    resetVote(state) {
      return {
        ...state,
        voteDetailData: {},
        startTime: 0,
        endTime: 0,
        optionCount: 0,
        totalVote: [],
        voteRecord: 0,
        isAlive: false,
        btnLoading: false,
        voteListData: [],
        dfBalance: 0,
      };
    },
    updateVoteListData(state, action) {
      return {
        ...state,
        voteListData: [...action.payload],
      };
    },
    updateModalVisible(state, action) {
      return {
        ...state,
        modalVisible: !!action.payload,
      };
    },
    updateVoteDetailData(state, action) {
      return {
        ...state,
        voteDetailData: action.payload,
      };
    },
    updateVotingData(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    updateBtnLoading(state, action) {
      return {
        ...state,
        btnLoading: !!action.payload,
      };
    },
  }
}
