import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import styles from './styles.module.css';

type SideModalProps = {
  open: boolean;
  children?: React.ReactNode;
  onClose?: () => void;
};

const SideModal: React.FC<SideModalProps> = ({ open, children, onClose }) => {
  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles['dialog-overlay']} onClick={() => onClose?.()} />
        <Dialog.Content className={styles['side-dialog-content']}>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
export default SideModal;
