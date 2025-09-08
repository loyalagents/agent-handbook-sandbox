import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import styles from './styles.module.css';

type TabsContentProps = {
  children: React.ReactNode;
  value: string;
  className?: string;
};

export default function TabsContent({
  children,
  value,
  className,
  ...props
}: TabsContentProps) {
  return (
    <Tabs.Content
      className={`${styles['tabs-content']} ${className || ''}`}
      value={value}
      {...props}
    >
      {children}
    </Tabs.Content>
  );
}
