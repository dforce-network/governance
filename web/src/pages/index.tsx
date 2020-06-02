import React from 'react';
import { connect } from 'dva';
import styles from './index.less';
import PageHeader from '@components/PageHeader';
import VotingList from '@components/VotingList';

@connect(({ governance, common, loading }) => ({
  common,
  governance,
  loading: loading.models.governance
}))
export default class IndexPage extends React.Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'governance/fetchVoteList'
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
