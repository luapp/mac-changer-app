/*
* Copyright (c) 2025 Paul Le Gall. All Rights Reserved.
* Licensed See LICENSE file in the project root for details.
*/

import type { ButtonProps, Variant } from '@ui/types/Button';

const variantClasses: Record<Variant, string> = {
  primary: 'bg-[var(--primary)]',
  warning: 'bg-[var(--warning)]',
  success: 'bg-[var(--success)]',
  error: 'bg-[var(--error)]',
  danger: 'bg-[var(--danger)]',
};

export const Button = ({
  children,
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  variant = 'warning',
  ...extraParameters
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-lg
        text-white
        transition
        duration-200
        ease-in-out
        hover:brightness-110
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${className}
      `}
      {...extraParameters}
    >
      {children}
    </button>
  );
};
