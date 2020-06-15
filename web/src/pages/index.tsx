import React from 'react';
import { connect } from 'dva';
import styles from './index.less';
import PageHeader from '@components/PageHeader';
import VotingList from '@components/VotingList';
import { initBrowserWallet, fetchDataOfTheContract } from '@utils/web3';

@connect(({ governance, common, loading }) => ({
  common,
  governance,
  loading: loading.models.governance
}))
export default class IndexPage extends React.Component {
  initWaleltData = () => {
    initBrowserWallet.bind(this)(false);
  }

  initVoteData = (c) => {
    const me = this;
    const hrefArray = window.location.href.split('/');
    if (hrefArray && hrefArray.length) {
      if (hrefArray[hrefArray.length - 1] === '') {
        fetchDataOfTheContract.bind(me)(c);
      }
    }
  }

  componentDidMount() {
    this.initWaleltData();

    this.props.dispatch({
      type: 'governance/fetchVoteList',
      callback: (c) => {
        this.initVoteData(c);

        setInterval(() => {
          this.initVoteData(c);
        }, 10000);
      }
    });
    document.getElementById('page__loader').style.display = 'none';
  }

  render() {
    return (
      <div className={styles.container}>
        <PageHeader { ...this.props } />

        <VotingList { ...this.props } />
      </div>
    );
  }
}
