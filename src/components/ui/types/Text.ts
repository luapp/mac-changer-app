import type React from 'react';

export type Variant = 'primary' | 'warning' | 'success' | 'error' | 'danger';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
}

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
}
