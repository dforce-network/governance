// format account address
import numeral from 'numeral';
import moment from 'moment';

// format time
export function timeFormatter(time) {
  return moment(time).format('YYYY-MM-DD HH:mm:ss');
}

// format time
export function transTimeFormatter(time: string) {
  moment.locale('en');

  let timeobj = moment(time);
  let timePrefix = timeobj.format('LL');
  let timeEnd = timeobj.format('HH:mm:ss');
  return `${timePrefix} at ${timeEnd}`;
}

// account formatter
export function accountFormatter(account: string) {
  if (account.length && account.length === 40) {
    return ('0x' + account).toLowerCase();
  }
  return account.toLowerCase();
}

// transactions hash formatter
export function transactionHashFormatter(hash: string) {
  return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
}

// to fixed
export function toFixed(num, decimal = 2) {
  // let result = (+(Math.round(+(num + 'e' + precision)) + 'e' + -precision)).toFixed(precision);
  // return +result;
  num = num.toString();
  let index = num.indexOf('.');
  if (index !== -1) {
    num = num.substring(0, decimal + index + 1);
  } else {
    num = num.substring(0);
  }
  return +parseFloat(num).toFixed(decimal);
}

// format percent
export function percentFormatter(v) {
  if (v === '...') return v;
  let fixValue = toFixed(parseFloat(v * 100));
  return `${fixValue}%`;
}

// format usr/usdx
export function transactionValueFormatter(v) {
  if (!v) return 0;
  let vStr = parseFloat(v).toFixed(4);
  return formatCurrencyNumber(parseFloat(vStr));
}

// format wallet address
export function accountHideFormatter(account: string) {
  let newaccount = accountFormatter(account);
  return `${newaccount.substring(0, 4)}...${newaccount.substring(newaccount.length - 4)}`;
}

// currency format
export function formatCurrencyNumber(b) {
  if (b === '...') return b;
  if (b > 0) {
    return numeral(b).format('0,0.00');
  }
  return '0';
}

export function isMobileDevice() {
  return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
}
