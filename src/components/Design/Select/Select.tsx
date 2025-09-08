import React from 'react';
import * as Select from '@radix-ui/react-select';
import styles from './styles.module.css';
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

type SelectRootProps = {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onValueChange?: (value: string) => void;
};

export default function SelectRoot({
  children,
  value,
  defaultValue,
  placeholder,
  onValueChange,
  ...props
}: SelectRootProps) {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger className={styles['select-trigger']} aria-label="Food">
        <Select.Value placeholder={placeholder} />
        <Select.Icon className={styles['select-icon']}>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className={styles['select-content']}>
          <Select.ScrollUpButton className={styles['select-scroll-button']}>
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className={styles['select-viewport']}>
            {children}
          </Select.Viewport>
          <Select.ScrollDownButton className={styles['select-scroll-button']}>
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
