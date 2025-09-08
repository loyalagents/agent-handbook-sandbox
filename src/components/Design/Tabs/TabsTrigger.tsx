import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import styles from './styles.module.css';

type TabsTriggerProps = {
  children: React.ReactNode;
  value: string;
  className?: string;
};

export default function TabsTrigger({
  children,
  value,
  className,
  ...props
}: TabsTriggerProps) {
  return (
    <Tabs.Trigger
      className={`${styles['tabs-trigger']} ${className || ''}`}
      value={value}
      {...props}
    >
      {children}
    </Tabs.Trigger>
  );
}
