import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import styles from './styles.module.css';

type ModalProps = {
  open: boolean;
  children?: React.ReactNode;
  size?: 'default' | 'medium' | 'large' | 'extra-large';
};

const Modal: React.FC<ModalProps> = ({ open, children, size = 'default' }) => {
  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles['dialog-overlay']} />
        <Dialog.Content
          className={`${styles['dialog-content']} ${
            styles['dialog-content-' + size]
          }`}
        >
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
export default Modal;
