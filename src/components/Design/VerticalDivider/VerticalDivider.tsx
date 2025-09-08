import * as React from 'react';

import styles from './styles.module.css';

type VerticalDividerProps = Record<string, never>;

const VerticalDivider: React.FC<VerticalDividerProps> = ({}) => {
  return <div className={styles['vertical-divider']}></div>;
};
export default VerticalDivider;
