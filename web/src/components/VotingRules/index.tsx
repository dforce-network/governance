import React from 'react';
import styles from './index.less';
import { renderContentFromKey } from '@utils';
import { formatMessage } from 'umi-plugin-locale';

interface VotingRulesProps {
  className?: string;
}

const VotingRules: React.FC<VotingRulesProps> = (props) => {

  const renderContent = (key: string) => {
    return renderContentFromKey.bind({ props })(key);
  }

  const renderRules = () => {
    if (props.loading || props.loading === undefined) {
      return;
    }
    let rulesArray = renderContent('remark');

    if (rulesArray && rulesArray.length) {
      return rulesArray.map((rule, key) => (
        <li key={key}>{rule }</li>
      ));
    }
  }

  return (
    <article className={styles.box__rules}>
      <h1>{ formatMessage({ id: 'voting.rule.title' }) }</h1>
      <ul>{ renderRules() }</ul>
    </article>
  );
};

export default VotingRules;
