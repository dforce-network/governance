import Web3 from 'web3';
import config from './config';
import DFABI from '../abi/DF.abi.json';
import VotingABI from '../abi/Voting.abi.json';
// import USDxABI from '../abi/USDx.abi.json';
import { message } from 'antd';
import { toFixed } from './index';
import moment from 'moment';

// set up contracts
export function setupContracts(dispatch) {
  const { web3, network } = this.props.common;
  const networkName = network == 1 ? 'main' :'rinkeby';

  const { contract_address } = this.props.governance.voteDetailData;

  dispatch('DFObj', new web3.eth.Contract(DFABI, config[networkName].DF));
  if (contract_address) {
    dispatch('votingObj', new web3.eth.Contract(VotingABI, contract_address));
  }
}

// get balance of usr and usdx
export async function getVotingData() {
  // await allowance.bind(this)();
  const { votingObj, walletAddress } = this.props.common;
  const startTime = await votingObj.methods.startTime().call();
  const endTime = await votingObj.methods.endTime().call();
  const optionCount = await votingObj.methods.optionCount().call();
  const totalVote = await votingObj.methods.getTotalVote().call();
  const voteRecord = await votingObj.methods.getVoteRecord(walletAddress).call();
  const isAlive = await votingObj.methods.isAlive().call();
  const currentTime = (new Date()).getTime();
  let voteStatus = 'voting';

  // 判断投票状态 是 ： notStart, ongoing, closed
  if (currentTime < startTime * 1000) {
    // 未开始
    voteStatus = 'notStart';
  } else if (currentTime >= startTime * 1000 && currentTime <= endTime * 1000) {
    voteStatus = 'ongoing';
    if (!isAlive) {
      voteStatus = 'closed';
    }
  } else {
    voteStatus = 'closed';
  }

  // console.log(voteStatus);
  // console.log(totalVote);
  // console.log(voteRecord);
  // console.log(isAlive);

  this.props.dispatch({
    type: 'governance/updateVotingData',
    payload: {
      startTime,
      endTime,
      optionCount,
      totalVote,
      voteRecord,
      isAlive,
      voteStatus,
    },
  });
}

// approval
export async function approval() {
  const { usdxObj, usrObj, walletAddress } = this.props.common;
  return usdxObj.methods.approve(usrObj.options.address, '-1')
    .send({ from: walletAddress })
    .then(() => {
      window.localStorage.setItem('approved', 'true');
    }
  );
}

// get allowance data
export async function allowance() {
  const { usdxObj, usrObj, walletAddress, network } = this.props.common;
  const networkName = network == 1 ? 'main' : 'rinkeby';
  const allowanceResult = await usdxObj.methods.allowance(walletAddress, config[networkName].USR).call();

  this.props.dispatch({
    type: 'common/updateMultiParams',
    payload: {
      allowanceResult: +allowanceResult
    }
  });
}

// init browser wallet
export async function initBrowserWallet(dispatch) {
  if (!dispatch) {
    dispatch = (name, value) => {
      this.props.dispatch({
        type: 'common/updateParams',
        payload: {
          name,
          value
        }
      });
    };
  }

  dispatch('walletLoading', true);

  let web3Provider;

  if (window.ethereum) {
    web3Provider = window.ethereum;
    try {
      // Request account access
      await window.ethereum.enable();
    } catch (error) {
      // User denied account access...
      console.error("User denied account access");
    }

    if (window.ethereum.on) {
      window.ethereum.on('accountsChanged', (accounts) => {
        initBrowserWallet.bind(this)();
      });
    }
  } else if (window.web3) {
    web3Provider = window.web3.currentProvider;
  } else {
    // If no injected web3 instance is detected, display err
    console.log("Please install MetaMask!");
    dispatch('web3Failure', true);
    return;
  }

  const web3 = new Web3(web3Provider);
  const network = await web3.eth.net.getId();

  dispatch('network', network);
  dispatch('web3Failure', false);
  dispatch('web3', web3);

  const walletType = 'browser';
  const accounts = await web3.eth.getAccounts();
  localStorage.setItem('walletKnown', true);

  dispatch('walletLoading', false);
  dispatch('walletAddress', accounts[0]);
  dispatch('walletType', walletType);

  setupContracts.bind(this)(dispatch);

  getVotingData.bind(this)();
}
