import * as React from 'react';
import { ReactNode } from 'react';
import styles from './styles.module.css';
import Image from 'next/image';

type ButtonGroupProps = {
  children: ReactNode;
};

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
}) => (
  <div className={styles['button-group']}>
    {children}
  </div>
);

export default ButtonGroup;
