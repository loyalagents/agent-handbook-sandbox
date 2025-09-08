import * as React from 'react';
import styles from './styles.module.css';

type SectionFooterProps = {
  content?: React.ReactNode;
  children?: React.ReactNode;
};

const SectionFooter: React.FC<SectionFooterProps> = ({  content, children }) => {
  return (
    <header className={styles['section-footer']}>
      <div className={styles['section-footer-content']}>{content}</div>
      <div className={styles['section-footer-actions']}>{children}</div>
    </header>
  );
};
export default SectionFooter;
