import React from 'react';
import logoUrl from './logo.png';
import starburstUrl from './starburst.png';
import * as styles from './HeaderLogo.styles';

export const HeaderLogo: React.FC = () => {
  return (
    <div className={styles.container}>
      <img alt="" className={styles.logo} src={logoUrl} />
      <img alt="" className={styles.starburst} src={starburstUrl} />
    </div>
  );
}
