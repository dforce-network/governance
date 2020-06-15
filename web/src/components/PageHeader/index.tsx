import React from 'react';
import { Menu, Dropdown, Drawer, Collapse } from 'antd';
import { accountHideFormatter } from '@utils';
import { formatMessage } from 'umi-plugin-locale';
import styles from './index.less';
import Link from 'umi/link';
import VotingAction from '../VotingAction';

const downSvg = require('@assets/icon_xl.svg');
const { Panel } = Collapse;
export default class PageHeader extends React.Component {
  state = {
    drawerVisible: false
  }

  onClose = () => {
    this.setState({
      drawerVisible: false
    });
  }

  openMenu = () => {
    this.setState({
      drawerVisible: true
    });
  }

  // connect wallet
  connectWallet = async () => {
    this.props.dispatch({
      type: 'common/updateModalVisible',
      payload: true
    });
  }

  render() {
    const { walletAddress = '' } = this.props.common;

    return (
      <div className={styles.header}>
        <a href="/" className={styles.header__logo}>
          <img src={require('@assets/logo.svg')} alt="logo" />
        </a>

        <img onClick={this.openMenu} className={styles.header__dropdown} src={require('@assets/icon_menu.svg')} alt="menu" />

        <div className={styles.header__menu}>
          <Dropdown
            overlay={
              <Menu className={styles.header__overlay}>
                <Menu.Item>
                  <a target="_blank" rel="noopener noreferrer" href="https://usdx.dforce.network/" className={styles.header__overlay_item}>
                    <span>USDx</span>
                    <label>{ formatMessage({ id: 'menu.assetsInfo'}) }</label>
                  </a>
                </Menu.Item>
              </Menu>
            }
          >
            <span className={styles.header__menu_item}>
              <label>{ formatMessage({ id: 'menu.assets'}) }</label>
              <img src={downSvg} alt="down" />
            </span>
          </Dropdown>

          <Dropdown
            overlay={
              <Menu className={styles.header__overlay}>
                <Menu.Item>
                  <a target="_blank" rel="noopener noreferrer" href="https://trade.dforce.network/" className={styles.header__overlay_item}>
                    <span>dForce Trade</span>
                    <label>{ formatMessage({ id: 'menu.tradeInfo'}) }</label>
                  </a>
                </Menu.Item>
              </Menu>
            }
          >
            <span className={styles.header__menu_item}>
              <label>{ formatMessage({ id: 'menu.trade'}) }</label>
              <img src={downSvg} alt="down" />
            </span>
          </Dropdown>

          <Dropdown
            overlay={
              <Menu className={styles.header__overlay}>
                <Menu.Item>
                  <a target="_blank" rel="noopener noreferrer" href="https://airdrop.dforce.network/" className={styles.header__overlay_item}>
                    <span>Airdrop</span>
                    <label>{ formatMessage({ id: 'menu.governanceInfo'}) }</label>
                  </a>
                </Menu.Item>
              </Menu>
            }
          >
            <span className={styles.header__menu_item}>
              <label>{ formatMessage({ id: 'menu.governance'}) }</label>
              <img src={downSvg} alt="down" />
            </span>
          </Dropdown>

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
                    <img src={require('@assets/metamask.svg')} />
                    { accountHideFormatter(walletAddress) }
                  </div>
                </a>
              ) : (<a className={styles.header__menu_wallet} onClick={this.connectWallet}>{ formatMessage({ id: 'menu.connectWallet' }) }</a>)
          }
        </div>

        <Drawer
          title={(
            <section className={styles.header}>
              <a href="/" className={styles.header__logo}>
                <img src={require('@assets/logo.svg')} alt="logo" />
              </a>

              <img className={styles.header__close} alt="close" onClick={this.onClose} src={require('@assets/icon_close.svg')} />
            </section>
          )}
          placement='top'
          closable={false}
          onClose={this.onClose}
          visible={this.state.drawerVisible}
          height="680"
        >
          <Collapse
            defaultActiveKey={['1', '2', '3']}
            expandIconPosition='right'
          >
            <Panel header={ formatMessage({ id: 'menu.assets'}) } key="1">
              <a target="_blank" rel="noopener noreferrer" href="https://usdx.dforce.network" className={styles.header__overlay_item}>
                <span>USDx</span>
                <label>{ formatMessage({ id: 'menu.assetsInfo'}) }</label>
              </a>
            </Panel>
            <Panel header={ formatMessage({ id: 'menu.trade'}) } key="2">
              <a target="_blank" rel="noopener noreferrer" href="https://trade.dforce.network/" className={styles.header__overlay_item}>
                <span>dForce Trade</span>
                <label>{ formatMessage({ id: 'menu.tradeInfo'}) }</label>
              </a>
            </Panel>
            <Panel header={ formatMessage({ id: 'menu.governance'}) } key="3">
              <a target="_blank" href="https://airdrop.dforce.network/" className={styles.header__overlay_item}>
                <span>Airdrop</span>
                <label>{ formatMessage({ id: 'menu.governanceInfo'}) }</label>
              </a>
            </Panel>
          </Collapse>
        </Drawer>

        <VotingAction { ...this.props } />
      </div>
    );
  }
}
