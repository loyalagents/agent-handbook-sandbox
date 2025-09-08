import React, { ThHTMLAttributes } from 'react';
import styles from './styles.module.css';

type ThProps = ThHTMLAttributes<HTMLTableCellElement> & {
  children: React.ReactNode;
  className?: string;
};

export default function Th({ children, className, ...props }: ThProps) {
  return (
    <th className={`${styles['th']} ${className || ''}`} {...props}>
      {children}
    </th>
  );
}
