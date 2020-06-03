import React from 'react';
import { connect } from 'dva';
import styles from './index.less';
import Banner from '@components/Banner';
import VotingTime from '@components/VotingTime';
import VotingRules from '@components/VotingRules';
import SelectWallet from '@components/SelectWallet';
import VotingOperation from '@components/VotingOperation';
import { initBrowserWallet } from '@utils/web3';

@connect(({ governance, common, loading }) => ({
  common,
  governance,
  loading: loading.models.governance
}))
export default class VotePage extends React.Component {
  dispatchValue = (name: string, value) => {
    this.props.dispatch({
      type: 'common/updateParams',
      payload: {
        name,
        value
      }
    });
  }

  initWallet = () => {
    let me = this;
    initBrowserWallet.bind(me)(me.dispatchValue);
    setInterval(() => {
      const hrefArray = window.location.href.split('/');
      if (hrefArray && hrefArray.length) {
        if (hrefArray[hrefArray.length - 1] === me.props.governance.voteDetailData._id) {
          initBrowserWallet.bind(me)(me.dispatchValue);
        }
      }
    }, 10000);
  }

  componentDidMount() {
    const payload = this.props.match.params.id;

    this.props.dispatch({
      type: 'governance/resetVote',
    });

    this.props.dispatch({
      type: 'governance/fetchVoteDetail',
      payload,
      callback: () => {
        this.initWallet();
      }
    });
    document.getElementById('page__loader').style.display = 'none';
  }

  render() {
    return (
      <div className={styles.container}>
        <Banner { ...this.props } />

        <section className={styles.box}>
          <VotingTime { ...this.props } />

          <VotingOperation { ...this.props } />

          <VotingRules { ...this.props } />

          <SelectWallet { ...this.props } />
        </section>
      </div>
    );
  }
}
