import * as React from 'react';
import { ReactNode } from 'react';
import Loader from './Loader';
import styles from './styles.module.css';

type ButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  active?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  size?: 'small' | 'medium' | 'large';
  startIcon?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset' | undefined;
  variant?:
    | 'success'
    | 'warning'
    | 'danger'
    | 'primary'
    | 'default'
    | 'text'
    | 'plain-text'
    | 'outline'
    | 'black';
};

const Button: React.FC<ButtonProps> = ({
  children,
  disabled = false,
  endIcon,
  fullWidth,
  loading,
  active,
  onClick,
  size,
  startIcon,
  type,
  variant = 'default',
}) => {
  const isDisabled = disabled || loading;

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (!isDisabled && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      className={`${styles['button']} ${size ? styles[size] : ''} ${
        styles[variant]
      } ${fullWidth ? 'full-width' : ''} ${active ? styles['active'] : ''}`}
      onClick={handleClick}
      disabled={disabled}
      type={type}
    >
      <div
        className={`${styles['content-container']} ${
          loading ? styles['content-loading'] : ''
        }`}
      >
        {startIcon && (
          <div className={styles['start-icon']} aria-hidden>
            {startIcon}
          </div>
        )}

        {children}

        {endIcon && (
          <div className={styles['end-icon']} aria-hidden>
            {endIcon}
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

export default Button;
