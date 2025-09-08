import * as React from 'react';
import { Item, Indicator } from '@radix-ui/react-radio-group';
import styles from './styles.module.css';

type RadioItemProps = {
  value: string;
  id: string;
  children?: React.ReactNode;
};

const RadioItem: React.FC<RadioItemProps> = ({ value, id, children }) => {
  return (
    <div className={styles['radio-item']}>
      <Item className={styles['radio-group-item']} value={value} id={id}>
        <Indicator className={styles['radio-group-indicator']} />
      </Item>
      <label className={styles['radio-group-label']} htmlFor="r1">
        {children}
      </label>
    </div>
  );
};
export default RadioItem;
