import React from 'react';
import * as Select from '@radix-ui/react-select';
import styles from './styles.module.css';

type SelectLabelProps = {
  children: React.ReactNode;
  className?: string;
};

export default function SelectIcon({
  children,
  className,
  ...props
}: SelectLabelProps) {
  return (
    <Select.Label
      className={`${styles['select-label']} ${className || ''}`}
      {...props}
    >
      {children}
    </Select.Label>
  );
}
