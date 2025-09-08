import * as React from 'react';
import styles from './styles.module.css';

type ModalFooterProps = {
  content?: React.ReactNode;
  children?: React.ReactNode;
};

const ModalFooter: React.FC<ModalFooterProps> = ({  content, children }) => {
  return (
    <header className={styles['modal-footer']}>
      <div className={styles['modal-footer-content']}>{content}</div>
      <div className={styles['modal-footer-actions']}>{children}</div>
    </header>
  );
};
export default ModalFooter;
