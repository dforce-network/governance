import React from 'react';
import styles from './index.less';
import PageHeader from '@components/PageHeader';

export default class Banner extends React.Component {
  render() {
    return (
      <div className={styles.container__banner}>
        <PageHeader {...this.props} />
        <div className={styles.container__banner_bg}></div>

        <article>
          <h1>dForce Governance Call</h1>

          <p>
            We have identified three key concerns with DAI and would like to implement a governance poll through voting system. Threekey concerns are respectively stability issue, complexities of MCD, and high friction of trading DAI <a>More...</a>
          </p>
        </article>
      </div>
    );
  }
}
