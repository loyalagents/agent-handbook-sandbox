import React, { TdHTMLAttributes } from 'react';
import styles from './styles.module.css';

type TdProps = TdHTMLAttributes<HTMLTableCellElement> & {
  children: React.ReactNode;
  className?: string;
};

export default function Td({ children, className, ...props }: TdProps) {
  return (
    <td className={`${styles['td']} ${className || ''}`} {...props}>
      {children}
    </td>
  );
}
