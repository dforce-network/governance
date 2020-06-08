import React from 'react';
import { Button } from 'antd';
import styles from './index.less';
import { renderContentFromKey, localTimeFormatter, formatCurrencyNumber, formatPercent } from '@utils';
import { formatMessage, getLocale } from 'umi-plugin-locale';
import Loading from '@components/Loading';
import router from 'umi/router';

interface VotingListProps {
  className?: string;
}

const VotingList: React.FC<VotingListProps> = (props) => {

  const currentLanguage = getLocale();
  const showKey = currentLanguage === 'en-US' ? 'info_en' : 'info_cn';

  const renderContent = (key: string) => {
    return renderContentFromKey.bind({ props })(key);
  }

  const formatVoteTime = (time) => {
    if (!time) {
      return '...';
    }
    return localTimeFormatter(new Date(time));
  }

  // fetch each status of vote
  const renderVoteStatus = (vote) => {
    let voteResultDOM = null;
    let voteOptionResultStr = null;
    let voteResult = vote.voteResult;
    let voteResultPercent = '';

    if (voteResult && voteResult.length) {
      let copyArray = [...voteResult];
      copyArray.sort();
      let maxValue = copyArray[copyArray.length - 1];
      let itemIndex = voteResult.indexOf(maxValue);

      voteOptionResultStr = vote[showKey].options[itemIndex];
      voteResultPercent = formatPercent(maxValue, copyArray);
    }

    if (vote.voteStatus === 'closed') {
      voteResultDOM = (
        <span className={styles.voting__item_remark}>
          { formatMessage({ id: 'voting.result.winner' }) } { voteOptionResultStr } <b>{ voteResultPercent }</b>
        </span>
      );
    }

    if (vote.voteStatus === 'ongoing') {
      voteResultDOM = (
        <span className={styles.voting__item_remark}>
          { formatMessage({ id: 'voting.result.expectedWinner' }) } { voteOptionResultStr }
        </span>
      );
    }

    return (
      <section>
        <span className={styles.voting__item_time}>
          <img src={require('@assets/icon_time.svg')} />
          { formatMessage({id: 'votelist.voteTime'}) } { formatVoteTime(vote.startTime) } - { formatVoteTime(vote.endTime) }
        </span>
        <span className={styles.voting__item_result}>
          <img src={require('@assets/icon_result.svg')} />{ vote.voteStatus ? formatMessage({ id: `voting.status.${vote.voteStatus}` }) : '...' }: % { formatMessage({ id: 'voting.participated' }) } <b>{ vote.participated }</b>,{ formatMessage({ id: 'voting.amount' }) }: <b>{ formatCurrencyNumber(vote.DFAmount) }</b> DF
        </span>
        { voteResultDOM }
      </section>
    );
  }

  // vote status
  const renderVoteStatusForBtn = (v) => {
    if (v.voteStatus) {
      const { voteStatus } = v;

      if (voteStatus === 'ongoing') {
        return (
          <Button type="primary">
            { formatMessage({id: 'voting.options.vote'}) }
          </Button>
        );
      } else if (voteStatus === 'closed') {
        return (
          <span className={styles.voting__item_passed}>{ formatMessage({ id: 'voting.status.closed' }) }</span>
        );
      } else if (voteStatus === 'fail') {
        return (
          <span className={styles.voting__item_fail}>{ formatMessage({ id: 'voting.status.fail' }) }</span>
        );
      } else if (voteStatus === 'notStart') {
        return null;
      }
    }
  }

  const renderVotes = () => {
    if (props.loading || props.loading === undefined) {
      return <Loading />;
    }

    if (props.governance.voteListData.length) {
      return props.governance.voteListData.map(vote => {
        return (
          <div
            className={styles.voting__item}
            key={vote._id}
            onClick={() => {
              router.push(`/vote/${vote._id}`)
            }}
          >
            <div>
              <h1>{ renderVoteItemFromKey(vote, 'vote_title') }</h1>
              { renderVoteStatusForBtn(vote) }
            </div>

            <p>{ renderVoteItemFromKey(vote, 'Description') }</p>

            { renderVoteStatus(vote) }

            <div className={styles.voting__item_h5}>
              { renderVoteStatusForBtn(vote) }
            </div>
          </div>
        )
      })
    }
  }

  const renderVoteItemFromKey = (voteObj, key: string) => {
    return voteObj[showKey][key];
  }

  return (
    <div className={styles.voting}>
      { renderVotes() }
    </div>
  );
};

export default VotingList;
