// import React from 'react';
// import styles from './index.less';
//
// const BasicLayout: React.FC = props => {
//   return (
//     <div className={styles.normal}>
//       <h1 className={styles.title}>Yay! Welcome to umi!</h1>
//       {props.children}
//     </div>
//   );
// };
//
// export default BasicLayout;

import styles from './index.less';
import React, { Component } from 'react';
import PageFooter from '@components/PageFooter';

class BasicLayout extends Component {
  render() {
    return (
      <div className={styles.container}>
        {this.props.children}
        <PageFooter />
      </div>
    );
  }
}

export default BasicLayout;
