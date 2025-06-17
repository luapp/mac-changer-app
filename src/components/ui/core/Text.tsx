/*
* Copyright (c) 2025 Paul Le Gall. All Rights Reserved.
* Licensed See LICENSE file in the project root for details.
*/

import type { TextProps, Variant, LabelProps } from '@ui/types/Text';

const variantClasses: Record<Variant, string> = {
  primary: 'text-[var(--primary)]',
  warning: 'text-[var(--warning)]',
  success: 'text-[var(--success)]',
  error: 'text-[var(--error)]',
  danger: 'text-[var(--danger)]',
};

export const H1 = ({ children, className = '', variant = 'primary', ...extraParameters }: TextProps) => (
  <h1 className={`text-4xl font-bold select-none ${variantClasses[variant]} ${className}`} {...extraParameters}>
    {children}
  </h1>
);

export const H2 = ({ children, className = '', variant = 'primary', ...extraParameters }: TextProps) => (
  <h2 className={`text-3xl font-semibold select-none ${variantClasses[variant]} ${className}`} {...extraParameters}>
    {children}
  </h2>
);

export const H3 = ({ children, className = '', variant = 'primary', ...extraParameters }: TextProps) => (
  <h3 className={`text-2xl font-semibold select-none ${variantClasses[variant]} ${className}`} {...extraParameters}>
    {children}
  </h3>
);

export const H4 = ({ children, className = '', variant = 'primary', ...extraParameters }: TextProps) => (
  <h4 className={`text-xl font-medium select-none ${variantClasses[variant]} ${className}`} {...extraParameters}>
    {children}
  </h4>
);

export const H5 = ({ children, className = '', variant = 'primary', ...extraParameters }: TextProps) => (
  <h5 className={`text-lg font-medium select-none ${variantClasses[variant]} ${className}`} {...extraParameters}>
    {children}
  </h5>
);

export const P = ({ children, className = '', variant = 'primary', ...extraParameters }: TextProps) => (
  <p className={`text-base select-none ${variantClasses[variant]} ${className}`} {...extraParameters}>
    {children}
  </p>
);

export const Label = ({ children, className = '', variant = 'primary', ...extraParameters }: LabelProps) => (
  <label className={`text-sm font-medium block ${variantClasses[variant]} ${className}`} {...extraParameters}>
    {children}
  </label>
);