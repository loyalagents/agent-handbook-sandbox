import React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { MixerHorizontalIcon, Cross2Icon } from '@radix-ui/react-icons';
import styles from './styles.module.css';

type PopoverRootProps = {
  trigger: React.ReactNode;
  children?: React.ReactNode;
  sideOffset?: number;
};

const PopoverRoot = ({
  trigger,
  children,
  sideOffset = 5,
}: PopoverRootProps) => (
  <Popover.Root>
    <Popover.Trigger asChild>{trigger}</Popover.Trigger>
    <Popover.Portal>
      <Popover.Content
        className={styles['popover-content']}
        sideOffset={sideOffset}
      >
        {children}
        <Popover.Close className={styles['popover-close']} aria-label="Close">
          <Cross2Icon />
        </Popover.Close>
        <Popover.Arrow className={styles['popover-arrow']} />
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
);

export default PopoverRoot;
