import * as React from 'react';
import { Root, Indicator } from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import styles from './styles.module.css';

type CheckboxProps = {
  onCheckedChange?: () => void;
  label?: string;
  id: string;
  checked: boolean;
  disabled?: boolean;
};

const Checkbox: React.FC<CheckboxProps> = ({
  onCheckedChange,
  label,
  id,
  checked = false,
  disabled = false,
}) => (
  <div className={styles['checkbox']}>
    <Root
      className={styles['checkbox-root']}
      checked={checked}
      id={id}
      disabled={disabled}
      onCheckedChange={onCheckedChange}
    >
      <Indicator className={styles['checkbox-indicator']}>
        {checked === true && <CheckIcon />}
      </Indicator>
    </Root>
    {label && (
      <label className={styles['label']} htmlFor={id}>
        {label}
      </label>
    )}
  </div>
);

export default Checkbox;
