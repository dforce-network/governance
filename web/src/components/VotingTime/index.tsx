import React from 'react';
import styles from './index.less';

interface VotingTimeProps {
  className?: string;
}

const VotingTime: React.FC<VotingTimeProps> = (props) => {
  return (
    <div className={styles.box__header}>
      <section>
        <img src={require("@assets/time_en.png")} />
        <span>End in</span>
      </section>

      <div className={styles.box__time}>
        <span>
          ···<label>DAYS:</label>
        </span>
        <span>
          ···<label>HOURS:</label>
        </span>
        <span>
          ···<label>MINUTES</label>
        </span>
      </div>
    </div>
  );
}

export default VotingTime;
