import React, { TableHTMLAttributes } from 'react';

type TheadProps = TableHTMLAttributes<HTMLTableSectionElement> & {
  children: React.ReactNode;
  className?: string;
};

export default function Thead({ children, className }: TheadProps) {
  return <thead className={`${className || ''}`}>{children}</thead>;
}
