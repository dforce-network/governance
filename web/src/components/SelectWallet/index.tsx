import React from 'react';
import { Modal } from 'antd';
import styles from './index.less';

export default class SelectWallet extends React.Component {
  render() {
    const walletItems = [
      {
        title: 'MetaMask',
        icon: require('@assets/metamask.svg')
      },
      {
        title: 'Coinbase Wallet',
        icon: require('@assets/coinbase.svg')
      },
      {
        title: 'WalletConnect',
        icon: require('@assets/walletconnect.svg')
      },
      {
        title: 'Fortmatic',
        icon: require('@assets/fortmatic.svg')
      }
    ];
    return (
      <Modal
        title="Connect Wallet"
        width={430}
        visible={this.props.governance.modalVisible}
        footer={null}
        onCancel={e => {
          this.props.dispatch({
            type: 'governance/updateModalVisible',
            payload: false
          });
        }}
        centered
      >
        <div className={styles.wallets}>
          {
            walletItems.map(item => (
              <section key={item.title}>
                <span>{ item.title }</span>

                <img src={ item.icon } />
              </section>
            ))
          }
        </div>
      </Modal>
    );
  }
}
