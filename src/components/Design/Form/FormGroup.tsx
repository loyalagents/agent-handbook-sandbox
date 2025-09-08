import React from 'react';
import styles from './styles.module.css';

type FormGroupProps = {
  children: React.ReactNode;
  className?: string;
};

export default function FormGroup({
  children,
  className,
  ...props
}: FormGroupProps) {
  return (
    <div
      className={`${styles['form-group']} ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
}
