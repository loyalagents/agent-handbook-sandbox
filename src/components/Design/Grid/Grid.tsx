import React from 'react';
import styles from './styles.module.css';

type GridProps = {
  children: React.ReactNode;
  columns?: number;
};

export default function Grid({
  children,
  columns = 2,
  ...props
}: GridProps) {
  return (
    <div
      className={`${styles['grid']} ${columns ? styles[`grid-columns-${columns}`] : ''}`}
      {...props}
    >
      {children}
    </div>
  );
}
