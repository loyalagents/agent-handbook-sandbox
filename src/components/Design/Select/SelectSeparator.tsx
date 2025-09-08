import React from 'react';
import * as Select from '@radix-ui/react-select';
import styles from './styles.module.css';

type SelectSeparatorProps = {
  className?: string;
};

export default function SelectIcon({
  className,
  ...props
}: SelectSeparatorProps) {
  return (
    <Select.Separator
      className={`${styles['select-separator']} ${className || ''}`}
      {...props}
    />
  );
}
