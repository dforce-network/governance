import Web3 from 'web3';
import config from './config';
import DFABI from '../abi/DF.abi.json';
import VotingABI from '../abi/Voting.abi.json';
// import USDxABI from '../abi/USDx.abi.json';
import { message } from 'antd';
import { toFixed, formatPercent, sumArray } from './index';
import moment from 'moment';

// set up contracts
export function setupContracts(dispatch) {
  const { web3, network } = this.props.common;
  const networkName = network == 1 ? 'main' :'rinkeby';

  const { contract_address } = this.props.governance.voteDetailData;

  if (contract_address) {
    dispatch('votingObj', new web3.eth.Contract(VotingABI, contract_address));
  }
}

export async function setupDFConstract(dispatch) {
  const { web3, network, walletAddress } = this.props.common;
  const networkName = network == 1 ? 'main' :'rinkeby';
  const DFObj = new web3.eth.Contract(DFABI, config[networkName].DF)
  const dfSupply = await DFObj.methods.totalSupply().call();
  const dfBalance = await DFObj.methods.balanceOf(walletAddress).call();

  dispatch('DFObj', DFObj);
  dispatch('DFSupply', dfSupply / 1e18);
  dispatch('dfBalance', dfBalance);
}

// get balance of usr and usdx
export async function getVotingData() {
  const { votingObj, DFObj, walletAddress, web3 } = this.props.common;

  const startTime = await votingObj.methods.startTime().call();
  const endTime = await votingObj.methods.endTime().call();
  const optionCount = await votingObj.methods.optionCount().call();
  const totalVote = await votingObj.methods.getTotalVote().call();
  const voteRecord = await votingObj.methods.getVoteRecord(walletAddress).call();
  const threshold = await votingObj.methods.threshold().call();
  const isAlive = await votingObj.methods.isAlive().call();
  const currentTime = (new Date()).getTime();
  const sumVote = sumArray(totalVote);
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

  // closed 分为 closed fail
  if (voteStatus === 'closed') {
    if (sumVote / 1e18 > threshold / 1e18) {
      voteStatus = 'closed';
    } else {
      voteStatus = 'fail';
    }
  }

  // console.log(dfBalance)
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

// fetch the data of the constract
// time: startTime, endTime
// status: vote / passed / fail
// DFAmount: DF总量,
// voteResult: 投票结果
// participated: 参与投票百分比
export async function fetchDataOfTheContract(constractAddress: string) {
  const { web3, network, walletAddress, DFObj } = this.props.common;
  const networkName = network == 1 ? 'main' :'rinkeby';

  if (constractAddress) {
    const votingObj = new web3.eth.Contract(VotingABI, constractAddress);
    const DFObj = new web3.eth.Contract(DFABI, config[networkName].DF)
    const startTime = await votingObj.methods.startTime().call();
    const endTime = await votingObj.methods.endTime().call();
    const totalVote = await votingObj.methods.getTotalVote().call();
    const isAlive = await votingObj.methods.isAlive().call();
    const threshold = await votingObj.methods.threshold().call();
    // const majorityPermillage = await votingObj.methods.majorityPermillage().call();
    const dfSupply = await DFObj.methods.totalSupply().call();
    const sumVote = sumArray(totalVote);

    // console.log(threshold, sumVote)
    // console.log(threshold)

    let percentValue = sumVote / dfSupply;
    let participated = '0%';
    let quorumValue = threshold / dfSupply;
    let quorum = '0%';

    if (threshold > 0) {
      if (quorumValue) {
        quorum = (quorumValue * 100).toFixed(2) + '%';
      }
    }

    if (percentValue) {
      participated = (percentValue * 100).toFixed(2) + '%';
    }
    // 判断投票的状态，是 开始，结束，还是失败

    const currentTime = (new Date()).getTime();
    let voteStatus = 'voting';

    // 判断投票状态 是 ： notStart, ongoing, closed
    // closed 分为 2中， success 和 fail
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

    // 投票结束的, 有2中情况  passed， fail
    if (voteStatus === 'closed') {
      if (sumVote / 1e18 > threshold / 1e18) {
        voteStatus = 'closed';
      } else {
        voteStatus = 'fail';
      }
    }

    this.props.dispatch({
      type: 'governance/updateDataForTheVote',
      payload: {
        constractAddress,
        startTime,
        endTime,
        voteStatus,
        DFAmount: dfSupply / 1e18,
        voteResult: totalVote,
        participated,
        quorum,
        sumVote: sumVote / 1e18,
      },
    });
  }
}

// init browser wallet
export async function initBrowserWallet(setContracts = true) {
  const dispatch = (name, value) => {
    this.props.dispatch({
      type: 'common/updateParams',
      payload: {
        name,
        value
      }
    });
  };

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
        this.props.dispatch({
          type: 'governance/resetVoteDataFromContract',
        });

        // set contract if in vote page, not in vote list page
        try {
          initBrowserWallet.bind(this)(!!this.props.match.params.id);
        } catch (err) {
          console.log(err);
        }
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

  setupDFConstract.bind(this)(dispatch);

  if (setContracts) {
    setupContracts.bind(this)(dispatch);
    getVotingData.bind(this)();
  }
}
