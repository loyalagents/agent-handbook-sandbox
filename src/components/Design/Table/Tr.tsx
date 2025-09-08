import React, { TdHTMLAttributes } from 'react';
import styles from './styles.module.css';

type TrProps = TdHTMLAttributes<HTMLTableRowElement> & {
  children: React.ReactNode;
  className?: string;
};

function Tr({ children, className, ...props }: TrProps) {
  return (
    <tr className={`${styles['tr']} ${className || ''} ${props.onClick ? styles['clickable'] : ''}`} {...props}>
      {children}
    </tr>
  );
}

export default Tr;
