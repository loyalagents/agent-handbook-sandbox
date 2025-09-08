import React, { TableHTMLAttributes } from 'react';
import styles from './styles.module.css';

type TableProps = TableHTMLAttributes<HTMLTableElement> & {
  children: React.ReactNode;
  className?: string;
  key?: string | number;
};

export default function Root({ children, className, ...props }: TableProps) {
  return (
    <table className={`${styles['table']} ${className || ''}`} {...props}>
      {children}
    </table>
  );
}