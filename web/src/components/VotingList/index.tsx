import React from 'react';
import { Button } from 'antd';
import styles from './index.less';
import { renderContentFromKey } from '@utils';
import { formatMessage, getLocale } from 'umi-plugin-locale';
import Loading from '@components/Loading';
import router from 'umi/router';

interface VotingListProps {
  className?: string;
}

const VotingList: React.FC<VotingListProps> = (props) => {

  const renderContent = (key: string) => {
    return renderContentFromKey.bind({ props })(key);
  }

  const renderVotes = () => {
    if (props.loading || props.loading === undefined) {
      return <Loading />;
    }
  }

  const renderVoteItemFromKey = (voteObj, key: string) => {
    const currentLanguage = getLocale();
    const showKey = currentLanguage === 'en-US' ? 'info_en' : 'info_cn';

    return voteObj[showKey][key];
  }

  return (
    <div className={styles.voting}>
      { renderVotes() }

      {
        props.governance.voteListData.map(vote => {
          return (
            <div className={styles.voting__item} key={vote._id}>
              <div>
                <h1>{ renderVoteItemFromKey(vote, 'vote_title') }</h1>
                <Button
                  type="primary"
                  onClick={e => {
                    router.push(`/vote/${vote._id}`)
                  }}
                >
                  { formatMessage({id: 'voting.options.vote'}) }
                </Button>
              </div>

              <p>{ renderVoteItemFromKey(vote, 'Description') }</p>

              <span className={styles.voting__item_time}>Vote on Mar 15, 2020, 19:15 UTC - Mar 25, 2020, 19:15 UTC</span>

              <span>Voting: % Percentage of DF participated is <b>5.12%</b>, Amount: <b>51,866,857.10</b> DF </span>
            </div>
          )
        })
      }
    </div>
  );
};

export default VotingList;
