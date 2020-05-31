import React from 'react';
import styles from './index.less';
import PageHeader from '@components/PageHeader';
import { renderContentFromKey } from '@utils';
import { formatMessage } from 'umi-plugin-locale';

export default class Banner extends React.Component {
  renderContent = (key: string) => {
    return renderContentFromKey.bind(this)(key);
  }

  render() {
    return (
      <div className={styles.container__banner}>
        <PageHeader {...this.props} />
        <div className={styles.container__banner_bg}></div>

        <article>
          <h1>{ this.renderContent('vote_title') }</h1>

          <p>
            { this.renderContent('Description') } <a href={ this.renderContent('more') } target="_blank">{ formatMessage({id: 'common.more'}) }</a>
          </p>
        </article>
      </div>
    );
  }
}
