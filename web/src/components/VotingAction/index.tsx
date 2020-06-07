import styles from './index.less';
import React from 'react';
import { formatMessage } from 'umi-plugin-locale';

export default function VotingAction(props) {
  let actionStatusDOM = null;
  let { actionVisible, actionStatus } = props.common;

  if (!actionVisible) {
    return null;
  }

  if (actionStatus === 'pending') {
    actionStatusDOM = (
      <div className={styles.action__status}>
        <img src={require('@assets/icon_voting.svg')} className={styles.action__status_voting} />
        <span>{ formatMessage({ id: 'voting.action.voting' }) }</span>
      </div>
    );
  } else if (actionStatus === 'failure') {
    actionStatusDOM = (
      <div className={styles.action__status}>
        <img src={require('@assets/icon_failure.svg')} />
        <span>{ formatMessage({ id: 'voting.action.failure' }) }</span>
      </div>
    );
  } else if (actionStatus === 'success') {
    actionStatusDOM = (
      <div className={styles.action__status}>
        <img src={require('@assets/icon_success.svg')} />
        <span>{ formatMessage({ id: 'voting.action.success' }) }</span>
      </div>
    );
  }

  return (
    <div className={styles.action}>
      { actionStatusDOM }

      <div
        className={styles.action__view}
        onClick={e => {
          if (props.common.actionTransactionHash) {
            if (props.common.network == 1) {
              window.open(`https://etherscan.io/tx/${props.common.actionTransactionHash}`);
            } else {
              window.open(`https://rinkeby.etherscan.io/tx/${props.common.actionTransactionHash}`);
            }
          }
        }}
      >
        <span>{ formatMessage({ id: 'voting.view' }) }</span>
        <img src={require('@assets/icon_view.svg')} />
      </div>
    </div>
  );
}
