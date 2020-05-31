import { message } from 'antd';

message.config({
  top: 100,
  maxCount: 1,
  duration: 3
});

export default {
  "defaultWeb3Provider": "https://mainnet.infura.io/v3/8facbab2998b411ea0cef95ae90b66f1",
  main: {
    "USDx": "0x1CBd0C8d16dd9C8f450c781b5c3e3623F95f7344",
    "DF": "0x5d378961e9d31c0ee394d34741fa1a18144f6fb5",
    "Voting": "0x97873617de316be61adb870cd4a678fd8eeff1f9"
  },
  rinkeby: {
    "USDx": "0xD96cC7f80C1cb595eBcdC072531e1799B3a2436E",
    "DF": "0x5d378961e9d31c0ee394d34741fa1a18144f6fb5",
    "Voting": "0x97873617de316be61adb870cd4a678fd8eeff1f9"
  }
};
