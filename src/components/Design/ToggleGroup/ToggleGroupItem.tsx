import * as React from 'react';
import { Item } from '@radix-ui/react-toggle-group';
import styles from './styles.module.css';

type ToggleItemProps = {
  value: string;
  name: string;
  children?: React.ReactNode;
};

const ToggleItem: React.FC<ToggleItemProps> = ({
  value,
  name,
  children,
}) => {
  return (
    <Item
      className={styles['toggle-group-item']}
      value={value}
      aria-label={name}
    >
      {children}
    </Item>
  );
};
export default ToggleItem;
