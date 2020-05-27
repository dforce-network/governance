import React from 'react';
import styles from './index.less';

interface VotingRulesProps {
  className?: string;
}

const VotingRules: React.FC<VotingRulesProps> = (props) => {
  return (
    <article className={styles.box__rules}>
      <h1>Voting mechanism</h1>
      <ul>
        <li>The governance poll will last for [7] days from [date] to [date] Oct.</li>
        <li>All DF holders will have the opportunity to signal your support for portfolio adjustments of USDx through voting system.</li>
        <li>Decision will be implemented if the following requirements are satisfied
    -Quorum: More than 5% of total tokens at the end of the voting period need to have participated in the vote ( Using signal method)
    -Threshold: More than 50% of the tokens that participated in the signal need to have voted “Yes”of the proposal (If the voting result is tied, the proposal won’t be implemented.)</li>
        <li>Governance decision will be disclosed to the dForce community after the governance poll.</li>
      </ul>
    </article>
  );
};

export default VotingRules;
