import React from 'react';
import styles from './styles.module.css';

type FormLabelProps = {
  id?: string;
  children: React.ReactNode;
  className?: string;
};

export default function FormLabel({
  id,
  children,
  className,
  ...props
}: FormLabelProps) {
  return (
    <label
      className={`${styles['form-label']} ${className || ''}`}
      htmlFor={id}
    >
      {children}
    </label>
  );
}
