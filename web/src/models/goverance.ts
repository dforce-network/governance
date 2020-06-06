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
    *fetchVoteList({ payload, callback }, { call, put }) {
      const response = yield call(getVoteList, payload);
      if (response && response.length) {
        yield put({
          type: 'updateVoteListData',
          payload: response,
        });

        if (callback) {
          response.map(vote => {
            callback(vote.contract_address);
          });
        }
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
    updateDataForTheVote(state, action) {
      const { constractAddress, startTime, endTime, voteStatus, DFAmount, voteResult, participated } = action.payload;
      const { voteListData } = state;

      if (voteListData && voteListData.length) {
        let filterResult = voteListData.filter(vote => vote.contract_address === constractAddress);
        if (filterResult.length) {
          filterResult[0].startTime = startTime * 1000;
          filterResult[0].endTime = endTime * 1000;
          filterResult[0].voteStatus = voteStatus;
          filterResult[0].DFAmount = DFAmount;
          filterResult[0].voteResult = voteResult;
          filterResult[0].participated = participated;
        }

        voteListData.sort((a, b) => {
          if (a.voteStatus === 'ongoing' && b.voteStatus !== 'ongoing') {
            return -1;
          } else if (a.voteStatus !== 'ongoing' && b.voteStatus === 'ongoing') {
            return 1;
          } else {
            return 0;
          }
        });
      }

      return {
        ...state,
        voteListData: [...voteListData],
      };
    },
  }
}
