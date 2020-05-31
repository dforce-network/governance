import React from 'react';
import { initBrowserWallet } from '@utils/web3';
import { accountHideFormatter } from '@utils';
import { formatMessage } from 'umi-plugin-locale';
import styles from './index.less';

export default class PageHeader extends React.Component {
  dispatchValue = (name: string, value: string) => {
    this.props.dispatch({
      type: 'common/updateParams',
      payload: {
        name,
        value
      }
    });
  }

  // connect wallet
  connectWallet = async () => {
    this.props.dispatch({
      type: 'common/updateModalVisible',
      payload: true
    });
  }

  componentDidMount() {
    let me = this;
    initBrowserWallet.bind(me)(me.dispatchValue);
    setInterval(() => {
      initBrowserWallet.bind(me)(me.dispatchValue);
    }, 10000);
  }

  render() {
    const { walletAddress = '' } = this.props.common;

    return (
      <div className={styles.header}>
        <a href="/" className={styles.header__logo}>
          <img src={require('@assets/logo.svg')} alt="logo" />
        </a>

        <img className={styles.header__dropdown} src={require('@assets/icon_menu.svg')} alt="menu" />

        <div className={styles.header__menu}>
          <a className={styles.header__menu_item}>Vote</a>
          <a className={styles.header__menu_item}>Pooling</a>
          {
            walletAddress ?
              (
                <a
                  className={styles.header__menu_wallet}
                  href={
                    this.props.common.network == 1
                      ? `https://etherscan.com/address/${walletAddress}`
                      : `https://rinkeby.etherscan.io/address/${walletAddress}`
                  }
                  target="_blank"
                >
                  <div>
                    <i style={{ backgroundColor: this.props.common.network == 1 ? '#29B6AF' : '#e2bc73' }}></i>
                    { accountHideFormatter(walletAddress) }
                  </div>
                </a>
              ) : (<a className={styles.header__menu_wallet} onClick={this.connectWallet}>{ formatMessage({ id: 'menu.connectWallet' }) }</a>)
          }
        </div>
      </div>
    );
  }
}
