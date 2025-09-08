import * as React from 'react';

import styles from './styles.module.css';

type AvatarProps = {
  name: string;
  role?: string;
};

const getInitials = (fullName: string) => {
  const charArray: any = fullName.replace(/[^a-zA-Z- ]/g, '').match(/\b\w/g);
  return charArray.join('');
};

const Avatar: React.FC<AvatarProps> = ({ name, role = 'user' }) => {
  return <div className={`${styles['avatar']} ${styles[role]}`}>{getInitials(name)}</div>;
};
export default Avatar;
