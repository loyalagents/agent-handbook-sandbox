import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import styles from './styles.module.css';

type TabsListProps = {
  children: React.ReactNode;
  className?: string;
};

export default function TabsList({
  children,
  className,
  ...props
}: TabsListProps) {
  return (
    <Tabs.List
      className={`${styles['tabs-list']} ${className || ''}`}
      {...props}
    >
      {children}
    </Tabs.List>
  );
}
