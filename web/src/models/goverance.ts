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
        response.map(vote => {
          vote.participated = '...';
          vote.DFAmount = '...';
          vote.quorum = '...';
          vote.sumVote = '...';
        })

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
        voteStatus: '',
      };
    },
    resetVoteDataFromContract(state) {
      return {
        ...state,
        startTime: 0,
        endTime: 0,
        optionCount: 0,
        totalVote: [],
        voteRecord: 0,
        isAlive: false,
        btnLoading: false,
        voteStatus: '',
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
      const { constractAddress, startTime, endTime, voteStatus, DFAmount, voteResult, participated, quorum, sumVote } = action.payload;
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
          filterResult[0].quorum = quorum;
          filterResult[0].sumVote = sumVote;
        }

        // voteListData.sort((a, b) => {
        //   if (a.voteStatus === 'ongoing' && b.voteStatus !== 'ongoing') {
        //     return -1;
        //   } else if (a.voteStatus !== 'ongoing' && b.voteStatus === 'ongoing') {
        //     return 1;
        //   } else {
        //     return 0;
        //   }
        // });

        const sortNumber = {
          ongoing: 4,
          notStart: 3,
          closed: 2,
          fail: 1,
        };

        voteListData.map(item => {
          if (item.voteStatus) {
            item.voteSortNumber = sortNumber[item.voteStatus];
          } else {
            item.voteSortNumber = 0;
          }
        });

        voteListData.sort((a, b) => {
          return b.voteSortNumber - a.voteSortNumber;
        });
      }

      return {
        ...state,
        voteListData: [...voteListData],
      };
    },
  }
}
