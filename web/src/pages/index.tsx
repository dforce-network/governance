import React from 'react';
import { connect } from 'dva';
import styles from './index.less';
import Banner from '@components/Banner';
import VotingTime from '@components/VotingTime';
import VotingRules from '@components/VotingRules';
import SelectWallet from '@components/SelectWallet';
import VotingOperation from '@components/VotingOperation';
import { formatMessage } from 'umi-plugin-locale';

@connect(({ governance }) => ({ governance }))
export default class Index extends React.Component {
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
