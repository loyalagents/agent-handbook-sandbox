import * as React from 'react';
import { Root } from '@radix-ui/react-toggle-group';
import styles from './styles.module.css';

type ToggleGroupProps = {
  value: string;
  defaultValue?: string;
  name?: string;
  type?: string;
  onValueChange: (value: any) => void;
  children: React.ReactNode;
};

const ToggleGroup: React.FC<ToggleGroupProps> = ({
  value,
  defaultValue,
  name,
  type = 'single',
  onValueChange,
  children,
}) => {
  return (
    <Root
      className={styles['toggle-group']}
      type="single"
      value={value}
      defaultValue={defaultValue}
      aria-label={name}
      onValueChange={onValueChange}
    >
      {children}
    </Root>
  );
};
export default ToggleGroup;
