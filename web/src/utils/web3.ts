import Web3 from 'web3';
import config from './config';
import USRABI from '../abi/USR.abi.json';
import USDxABI from '../abi/USDx.abi.json';
import { message } from 'antd';
import { toFixed, saveTransactions, updateTransactionStatus, timeFormatter } from './index';

// let Decimal = require('decimal.js-light');
// Decimal = require('toformat')(Decimal);
//
// export const WadDecimal = Decimal.clone({
//   rounding: 1, // round down
//   precision: 78,
//   toExpNeg: -18,
//   toExpPos: 78,
// })
//
// WadDecimal.format = {
//   groupSeparator: ",",
//   groupSize: 3,
// }


// set up contracts
export function setupContracts(dispatch) {
  const { web3, network } = this.props.governance;
  let networkName = network == 1 ? 'main' :'rinkeby';

  dispatch('usrObj', new web3.eth.Contract(USRABI, config[networkName].USR));
  dispatch('usdxObj', new web3.eth.Contract(USDxABI, config[networkName].USDx));
}

// get balance of usr and usdx
export async function getData() {
  await allowance.bind(this)();
}

// approval
export async function approval() {
  const { usdxObj, usrObj, walletAddress } = this.props.usr;
  return usdxObj.methods.approve(usrObj.options.address, '-1')
    .send({ from: walletAddress })
    .then(() => {
      window.localStorage.setItem('approved', 'true');
    }
  );
}

// get allowance data
export async function allowance() {
  const { usdxObj, usrObj, walletAddress, network } = this.props.usr;
  const networkName = network == 1 ? 'main' : 'rinkeby';
  const allowanceResult = await usdxObj.methods.allowance(walletAddress, config[networkName].USR).call();

  this.props.dispatch({
    type: 'governance/updateMultiParams',
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
        type: 'governance/updateParams',
        payload: {
          name,
          value
        }
      });
    };
  }

  dispatch('walletLoading', true);
  // if (!localStorage.getItem('walletKnown') && !prompt) return;

  let web3Provider;

  // Initialize web3 (https://medium.com/coinmonks/web3-js-ethereum-javascript-api-72f7b22e2f0a)
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
          type: 'governance/resetInput'
        });
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

  // setupContracts.bind(this)(dispatch);

  // getData.bind(this)();
}
