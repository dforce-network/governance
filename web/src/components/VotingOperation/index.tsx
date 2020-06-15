import React from 'react';
import { Button, message } from 'antd';
import styles from './index.less';
import { renderContentFromKey, localTimeFormatter, formatVoteNum, formatPercent } from '@utils';
import { formatMessage } from 'umi-plugin-locale';

export default class VotingOperation extends React.Component {
  state = {
    selectedIndex: -1,
    userSelected: false,
  }

  renderContent = (key: string) => {
    return renderContentFromKey.bind(this)(key);
  }

  // render vote options
  renderOptions = () => {
    if (this.props.loading || this.props.loading === undefined) {
      return;
    }

    let optionsArray = this.renderContent('options');
    let { totalVote, voteRecord, voteStatus } = this.props.governance;
    let selectedIndex = this.state.selectedIndex;

    if (!this.state.userSelected) {
      if (+voteRecord) {
        selectedIndex = voteRecord - 1;
      }
    }

    if (optionsArray && optionsArray.length) {
      const optionsObjArray = optionsArray.map((option, key) => {
        let polls = '...';
        let proportion = '...';

        if (totalVote && totalVote.length && totalVote.length > key) {
          polls = totalVote[key];

          if (polls) {
            proportion = formatPercent(polls, totalVote);
          }
          if (voteStatus === 'notStart') {
            polls = '...';
          }
        }

        return {
          key,
          proportion,
          name: option,
          polls: formatVoteNum(polls),
        };
      });

      return optionsObjArray.map((item, key) => (
        <div
          className={ key === selectedIndex ? styles.options__item_selected : styles.options__item }
          key={item.key}
          onClick={() => {
            //if (+voteRecord > 0) return;

            if (this.props.governance.isAlive) {
              this.setState({
                selectedIndex: key,
                userSelected: true,
              });
            }
          }}
        >
          <span>{ item.name }</span>
          <span className={styles.options__item_polls}>{ item.polls }</span>
          <span>{ item.proportion }</span>
        </div>
      ));
    }
  }

  // vote
  handleVote = async () => {
    const { selectedIndex } = this.state;
    const { votingObj, walletAddress } = this.props.common;
    const { dispatch } = this.props;

    if (!this.props.governance.isAlive) {
      return;
    }

    if (selectedIndex >= 0 && votingObj) {
      dispatch({
        type: 'governance/updateBtnLoading',
        payload: true,
      });

      // const voteResult = await
      // save localStorage
      /*
        name: wallet__network
        value: [{ tx: transaction_id, status: 'pending' }]
      */
      const voteResult = await votingObj.methods.vote(selectedIndex + 1).send(
        { from: walletAddress, gas: 1000000 },
        (resFail, resSuccess) => {
          // enable the vote button
          dispatch({
            type: 'governance/updateBtnLoading',
            payload: false
          });

          // show the action panel if res success
          if (resSuccess) {
            dispatch({
              type: 'common/updateTransAction',
              payload: {
                actionStatus: 'pending',
                actionVisible: true,
                actionTransactionHash: resSuccess,
              },
            });
          }

          if(resFail && resFail.message) {
            message.error(resFail.message);
          }
        }
      );

      // vote success
      if (voteResult && voteResult.status && voteResult.transactionHash) {
        dispatch({
          type: 'common/updateTransAction',
          payload: {
            actionStatus: 'success',
            actionVisible: true,
            actionTransactionHash: voteResult.transactionHash,
          },
        });

        // hide after 3000ms
        setTimeout(() => {
          dispatch({
            type: 'common/updateTransAction',
            payload: {
              actionVisible: false,
            }
          });
        }, 3000);
      }

      setTimeout(() => {
        dispatch({
          type: 'governance/updateBtnLoading',
          payload: false,
        });
      }, 1000);
    }
  }

  // start time of voting
  renderVotingStartTime = () => {
    const { startTime } = this.props.governance;
    if (!startTime) {
      return formatMessage({ id: 'voting.options.time' }) + '...';
    }
    const startTimeStr = localTimeFormatter(new Date(startTime * 1000));

    return formatMessage({ id: 'voting.options.time' }) + ' ' + startTimeStr;
  }

  // end time of voting
  renderVotingEndTime = () => {
    const { endTime } = this.props.governance;
    if (!endTime) {
      return '...';
    }
    return localTimeFormatter(new Date(endTime * 1000));
  }

  // vote button
  renderVoteBtn = () => {
    let { voteStatus } = this.props.governance;

    return (
      <Button
        type="primary"
        disabled={ this.state.selectedIndex < 0 || voteStatus !== 'ongoing' || this.props.governance.btnLoading }
        onClick={this.handleVote}
      >
        { formatMessage({ id: ['closed', 'fail'].indexOf(voteStatus) >= 0  ? 'voting.options.voteClosed' : 'voting.options.vote' }) }
      </Button>
    );
  }

  // your votes
  renderYourVote = () => {
    const { dfBalance } = this.props.common;
    const { voteRecord, voteDetailData } = this.props.governance;
    const optionsArray = this.renderContent('options');

    if (optionsArray && optionsArray!== '...' && optionsArray.length) {
      if (voteRecord && +voteRecord > 0) {
        let theOptionStr = '';
        if (voteRecord - 1 < optionsArray.length) {
          theOptionStr = optionsArray[voteRecord - 1];
        }

        let theOptionResult = theOptionStr;
        if (theOptionStr.indexOf(':') > 0) {
          theOptionResult = theOptionStr.split(':')[0];
        }
        return <i>{ theOptionResult }: { formatVoteNum(dfBalance) }</i>;
      }
    }
    return <label>...</label>;
  }

  // 胜出，票数，占比
  renderVoteResult = () => {
    const { voteStatus, totalVote } = this.props.governance;
    const optionsArray = this.renderContent('options');
    const win = { name: 'voting.detail.win', value: '...' };
    const polls = { name: 'voting.detail.polls', value: '...' };
    const proportion = { name: 'voting.detail.proportion', value: '...' };

    if (['closed', 'fail'].indexOf(voteStatus) >= 0) {
      if (totalVote && totalVote.length) {
        let copyArray = [...totalVote];
        copyArray.sort();
        let maxValue = copyArray[copyArray.length - 1];
        let itemIndex = totalVote.indexOf(maxValue);

        if (itemIndex >= 0) {
          win.value = optionsArray[itemIndex];
          polls.value = formatVoteNum(maxValue);
          proportion.value = formatPercent(maxValue, totalVote);
        }
      }
    }

    if (['fail', 'ongoing'].indexOf(voteStatus) >= 0 ) {
      return;
    }

    return [win, polls, proportion].map(item => (
      <div className={styles.detail__item} key={item.name}>
        <span>{ formatMessage({ id: item.name }) }</span>
        <label>{ item.value }</label>
      </div>
    ));
  }

  render() {
    const { voteStatus } = this.props.governance;
    const { dfBalance } = this.props.common;

    return (
      <div className={styles.operation}>
        <section className={styles.vote}>
          <h2>{ this.renderContent('title') }</h2>
          <p>({ this.renderVotingStartTime() })</p>

          <div className={styles.options}>
            <div className={styles.options__header}>
              <span>{ formatMessage({ id: 'voting.options.Option' }) }</span>
              <span className={styles.options__header_polls}>{ formatMessage({ id: 'voting.options.Polls' }) }</span>
              <span>{ formatMessage({ id: 'voting.options.Proportion' }) }</span>
            </div>

            { this.renderOptions() }
          </div>

          <div className={styles.footer}>
            { this.renderVoteBtn() }

            <div className={styles.footer__balance}>
              <span>{ formatMessage({ id: 'common.dfBalance' }) }</span>
              <label>{ formatVoteNum(dfBalance) }</label>
            </div>
          </div>
        </section>

        <section className={styles.detail}>
          <div className={styles.detail__header}>
            <h2>{ formatMessage({ id: 'voting.detail.details' }) }</h2>
            <div>
              <span>{ formatMessage({ id: 'voting.detail.yourVotes' }) }</span>

              { this.renderYourVote() }
            </div>
          </div>

          <div className={styles.detail__result}>
            <h2 className={styles.detail__title}>{ formatMessage({ id: 'voting.detail.results' }) }</h2>

            <div className={styles.detail__item}>
              <span>{ formatMessage({ id: 'voting.detail.endTime' }) }</span>
              <label>{ this.renderVotingEndTime() }</label>
            </div>
            { this.renderVoteResult() }

            {
              voteStatus === 'closed'
              ? <div className={styles.detail__result_status}>
                  <img src={require('@assets/icon_closed.svg')} />
                </div>
              : null
            }
            {
              voteStatus === 'fail'
              ? <div className={styles.detail__result_status}>
                  <img src={require('@assets/icon_fail.svg')} />
                </div>
              : null
            }
            {
              voteStatus === 'ongoing'
              ? <div className={styles.detail__result_ongoing}>
                  <img src={require('@assets/icon_ongoing.svg')} />
                  <span>{ formatMessage({ id: 'voting.status.ongoing' }) }</span>
                </div>
              : null
            }
            {
              voteStatus === 'fail' ? <p className={styles.detail__result_failure}>{ formatMessage({ id: 'common.failure' }) }</p> : null
            }
          </div>
        </section>
      </div>
    );
  }
}
