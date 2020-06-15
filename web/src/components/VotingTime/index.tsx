import React from 'react';
import styles from './index.less';
import moment from 'moment';
import { formatMessage } from 'umi-plugin-locale';

interface VotingTimeProps {
  className?: string;
}

const VotingTime: React.FC<VotingTimeProps> = (props) => {
  let endTime = 0;
  let leftDays = '...';
  let leftHours = '...';
  let leftMinutes = '...';
  let endTimeObj = null;
  let currentTime = (new Date()).getTime();

  if (props.governance.endTime) {
    if (props.governance.voteStatus !== 'closed') {
      endTime = props.governance.endTime * 1000;

      if (endTime > currentTime) {
        let tempTime = moment.duration((endTime - currentTime) / 1000, 'seconds');
        leftDays = tempTime.days();
        leftHours = tempTime.hours();
        leftMinutes = tempTime.minutes();
      } else {
        leftDays = leftHours = leftMinutes = 0;
      }
    } else {
      leftDays = leftHours = leftMinutes = 0;
    }
  }

  return (
    <div className={styles.box__header}>
      <section>
        <img src={require("@assets/time_en.png")} />
        <span>{ formatMessage({ id: 'voting.time.endin' }) }</span>
      </section>

      <div className={styles.box__time}>
        <span>
          { leftDays }<label>{ formatMessage({ id: 'voting.time.DAYS' }) }</label>
        </span>
        <span>
          { leftHours }<label>{ formatMessage({ id: 'voting.time.HOURS' }) }</label>
        </span>
        <span>
          { leftMinutes }<label>{ formatMessage({ id: 'voting.time.MINUTES' }) }</label>
        </span>
      </div>
    </div>
  );
}

export default VotingTime;
