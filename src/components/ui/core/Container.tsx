/*
* Copyright (c) 2025 Paul Le Gall. All Rights Reserved.
* Licensed See LICENSE file in the project root for details.
*/

import type { ContainerProps, Variant } from '@ui/types/Container';

const variantClasses: Record<Variant, string> = {
  primary: 'bg-[var(--container)] ',
  warning: 'bg-[var(--warning)]',
  success: 'bg-[var(--success)]',
  error: 'bg-[var(--error)]',
  danger: 'bg-[var(--danger)]',
};

export const Container = ({
  children,
  className = '',
  variant = 'primary',
  ...extraParameters
}: ContainerProps) => {
  return (
    <div
      className={`
p-4 rounded-3xl mx-10 blur-5 border border-white/30 shadow-[0_4px_10px_rgba(255,255,255,0.15)]
        ${variantClasses[variant]}
        ${className}
      `}
      {...extraParameters}
    >
      {children}
    </div>
  );
};
