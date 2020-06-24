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
        <div className={styles.voting__item_remark}>
          { formatMessage({ id: 'voting.result.winner' }) } { voteOptionResultStr } <b>{ voteResultPercent }</b>
        </div>
      );
    }

    if (vote.voteStatus === 'ongoing') {
      voteResultDOM = (
        <div className={styles.voting__item_remark}>
          { formatMessage({ id: 'voting.result.expectedWinner' }) } { voteOptionResultStr }, <b>{ voteResultPercent }</b>
        </div>
      );
    }

    return (
      <section>
        <div className={styles.voting__item_time}>
          <img src={require('@assets/icon_time.svg')} />
          <p>{ formatMessage({id: 'votelist.voteTime'}) } { formatVoteTime(vote.startTime) } - { formatVoteTime(vote.endTime) }</p>
        </div>
        <div className={styles.voting__item_result}>
          <img src={require('@assets/icon_result.svg')} />
          <p>{ vote.voteStatus ? formatMessage({ id: `voting.status.${vote.voteStatus}` }) : '...' }: { formatMessage({ id: 'voting.participated' }) } <span>({ formatMessage({ id: 'voting.quorum' }) } { formatMessage({ id: 'voting.quorum.is' }) } <b>{ vote.quorum }</b>)</span> { formatMessage({ id: 'voting.quorum.is' })} <b>{ vote.participated }</b>, { formatMessage({ id: 'voting.amount' }) }: <b>{ formatCurrencyNumber(vote.sumVote) }</b> DF
          </p>
        </div>
        { voteResultDOM }
      </section>
    );
  }

  // vote status
  const renderVoteStatusForBtn = (v) => {
    if (v.voteStatus) {
      const { voteStatus } = v;

      if (voteStatus === 'ongoing' || voteStatus === 'notStart') {
        return (
          <Button
            type="primary"
            disabled={voteStatus === 'notStart'}
            onClick={() => {
              if (v.voteStatus && v.voteStatus === 'ongoing') {
                router.push(`/vote/${v._id}`);
              }
            }}
          >
            { formatMessage({id: 'voting.options.vote'}) }
          </Button>
        );
      } else if (voteStatus === 'closed') {
        return (
          <span
            onClick={() => {
              router.push(`/vote/${v._id}`);
            }}
            className={styles.voting__item_passed}
          >
            { formatMessage({ id: 'voting.status.closed' }) }
          </span>
        );
      } else if (voteStatus === 'fail') {
        return (
          <span
            onClick={() => {
              router.push(`/vote/${v._id}`);
            }}
            className={styles.voting__item_fail}
          >
            { formatMessage({ id: 'voting.status.fail' }) }
          </span>
        );
      } else {
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
          >
            <div className={styles.voting__item_header}>
              <h1>{ renderVoteItemFromKey(vote, 'vote_title') }</h1>
              { renderVoteStatusForBtn(vote) }
            </div>

            <p className={styles.voting__item_content}>{ renderVoteItemFromKey(vote, 'Description') }</p>

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
