import React, { TableHTMLAttributes } from 'react';

type TbodyProps = TableHTMLAttributes<HTMLTableSectionElement> &  {
    children: React.ReactNode;
    className?: string;
};

export default function Tbody({ children, className }: TbodyProps) {
  return (
    <tbody className={`${className || ''}`}>
        {children}
    </tbody>
  );
}