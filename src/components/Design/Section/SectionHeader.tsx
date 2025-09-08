import * as React from 'react';
import styles from './styles.module.css';

type SectionHeaderProps = {
  name: string;
  children?: React.ReactNode;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({ name, children }) => {
  return (
    <header className={styles['section-header']}>
      <div className={styles['section-header-content']}>{name}</div>
      <div className={styles['section-header-actions']}>{children}</div>
    </header>
  );
};
export default SectionHeader;
