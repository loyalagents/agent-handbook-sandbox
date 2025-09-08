import React from 'react';
import styles from './styles.module.css';

type FormMessageProps = {
  children: React.ReactNode;
  className?: string;
};

export default function FormMessage({
  children,
  className,
  ...props
}: FormMessageProps) {
  return (
    <div className={`${styles['form-message']} ${className || ''}`} {...props}>
      {children}
    </div>
  );
}
