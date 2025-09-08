import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import styles from './styles.module.css';

type TabsRootProps = {
  children: React.ReactNode;
  defaultValue?: string;
  className?: string;
};

export default function TabsRoot({
  children,
  defaultValue,
  className,
  ...props
}: TabsRootProps) {
  return (
    <Tabs.Root
      className={`${styles['tabs-root']} ${className || ''}`}
      defaultValue={defaultValue}
      {...props}
    >
      {children}
    </Tabs.Root>
  );
}
