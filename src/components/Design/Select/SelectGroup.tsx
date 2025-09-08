import React from 'react';
import * as Select from '@radix-ui/react-select';

type SelectGroupProps = {
  children: React.ReactNode;
};

export default function SelectGroup({ children, ...props }: SelectGroupProps) {
  return <Select.Group {...props}>{children}</Select.Group>;
}
