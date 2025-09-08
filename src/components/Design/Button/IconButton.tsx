import * as React from 'react';
import { ReactNode } from 'react';
import Loader from './Loader';
import styles from './styles.module.css';

type IconButtonProps = {
  disabled?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
  active?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  size?: 'small' | 'medium' | 'large';
  type?: 'button' | 'submit' | 'reset' | undefined;
  variant?:
    | 'success'
    | 'warning'
    | 'danger'
    | 'primary'
    | 'default'
    | 'text'
    | 'plain-text';
};

const IconButton: React.FC<IconButtonProps> = ({
  disabled = false,
  icon,
  loading,
  active,
  onClick,
  size,
  type,
  variant = '',
}) => {
  const isDisabled = disabled || loading;

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (!isDisabled && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      className={`${styles['icon-button']} ${size ? styles[size] : ''} ${
        styles[variant]
      } ${active && styles['active']}`}
      onClick={handleClick}
      disabled={disabled}
      type={type}
    >
      <div
        className={`${styles['content-container']} ${
          loading ? styles['content-loading'] : ''
        }`}
      >
        {icon && (
          <div className={styles['icon']} aria-hidden>
            {icon}
          </div>
        )}
      </div>

      {loading && (
        <div className={styles['loader-container']} aria-label="loading">
          <Loader />
        </div>
      )}
    </button>
  );
};

export default IconButton;
