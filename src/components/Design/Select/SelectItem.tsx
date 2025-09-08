import React from 'react';
import * as Select from '@radix-ui/react-select';
import styles from './styles.module.css';
import { CheckIcon } from '@radix-ui/react-icons';

type SelectItemProps = {
  children: React.ReactNode;
  value: string;
  className?: string;
};

export default function SelectItem({
  children,
  value,
  className,
  ...props
}: SelectItemProps) {
  return (
    <Select.Item
      className={`${styles['select-item']} ${className || ''}`}
      value={value}
      {...props}
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className={styles['select-item-indicator']}>
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
}
