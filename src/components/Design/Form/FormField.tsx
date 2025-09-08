import React from 'react';
import styles from './styles.module.css';

type FormFieldProps = {
  children: React.ReactNode;
  className?: string;
};

export default function FormField({
  children,
  className,
  ...props
}: FormFieldProps) {
  return (
    <div
      className={`${styles['form-field']} ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
}
