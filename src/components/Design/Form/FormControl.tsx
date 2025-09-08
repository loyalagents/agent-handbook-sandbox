import React from 'react';
import styles from './styles.module.css';

type FormControlProps = {
  children: React.ReactNode;
  className?: string;
};

export default function FormControl({
  children,
  className,
  ...props
}: FormControlProps) {
  return (
    <div
      className={`${styles['form-control']} ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
}
