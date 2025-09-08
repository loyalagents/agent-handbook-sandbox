import * as React from 'react';
import styles from './styles.module.css';

type ModalHeaderProps = {
  name: string;
  children?: React.ReactNode;
};

const ModalHeader: React.FC<ModalHeaderProps> = ({ name, children }) => {
  return (
    <header className={styles['modal-header']}>
      <div className={styles['modal-header-content']}>{name}</div>
      <div className={styles['modal-header-actions']}>{children}</div>
    </header>
  );
};
export default ModalHeader;
