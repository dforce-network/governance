import React from 'react';
import { Button } from 'antd';
import styles from './index.less';

export default class VotingOperation extends React.Component {
  render() {
    return (
      <div className={styles.operation}>
        <section className={styles.vote}>
          <h2>Removing DAI from the basket of USDx?</h2>
          <p>(Start from ··· )</p>

          <div className={styles.options}>
            <div className={styles.options__header}>
              <span>Option</span>
              <span>Polls</span>
              <span>Proportion</span>
            </div>

            <div className={styles.options__item}>
              <span>YES: remove DAI from the constituents</span>
              <span>···</span>
              <span>···</span>
            </div>

            <div className={styles.options__item}>
              <span>NO: keep DAI in the constituents</span>
              <span>···</span>
              <span>···</span>
            </div>

            <div className={styles.options__item}>
              <span>IDONTCARE</span>
              <span>···</span>
              <span>···</span>
            </div>
          </div>

          <div className={styles.footer}>
            <Button disabled>Vote</Button>
          </div>
        </section>

        <section className={styles.detail}>
          <div className={styles.detail__header}>
            <h2>Details</h2>
            <div>
              <span>Your Votes</span>

              <label>···</label>
            </div>
          </div>

          <h2 className={styles.detail__title}>Results</h2>
          <div className={styles.detail__item}>
            <span>End time</span>
            <label>···</label>
          </div>
          <div className={styles.detail__item}>
            <span>Win</span>
            <label>···</label>
          </div>
          <div className={styles.detail__item}>
            <span>Polls</span>
            <label>···</label>
          </div>
          <div className={styles.detail__item}>
            <span>Proportion</span>
            <label>···</label>
          </div>
        </section>
      </div>
    );
  }
}
