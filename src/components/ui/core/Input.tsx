/*
* Copyright (c) 2025 Paul Le Gall. All Rights Reserved.
* Licensed See LICENSE file in the project root for details.
*/

import type { InputProps, InputVariant } from '@ui/types/Input';

const variantClasses: Record<InputVariant, string> = {
  primary: `
    bg-[var(--background)]
    border
    border-[var(--primary)]
    text-[var(--text)]
    rounded-md
    px-3
    py-2
    focus:outline-none
    focus:ring-2
    focus:ring-[var(--primary)]
    focus:ring-opacity-50
    transition
    duration-200
    ease-in-out
  `,
};

export const Input = ({
  variant = 'primary',
  className = '',
  type = 'text',
  ...extraParameters
}: InputProps) => {
  return (
    <input
      type={type}
      className={`${variantClasses[variant]} ${className}`}
      {...extraParameters}
    />
  );
};
