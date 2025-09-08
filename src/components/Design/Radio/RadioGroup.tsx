import * as React from 'react';
import { Root } from '@radix-ui/react-radio-group';
import styles from './styles.module.css';

type RadioGroupProps = {
  value: string;
  defaultValue?: string;
  name?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
};

const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  defaultValue,
  name,
  onValueChange,
  children,
}) => {
  return (
    <Root
      className={styles['radio-group']}
      value={value}
      defaultValue={defaultValue}
      aria-label={name}
      onValueChange={onValueChange}
    >
      {children}
    </Root>
  );
};
export default RadioGroup;
