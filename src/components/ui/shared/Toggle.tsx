/*
* Copyright (c) 2025 Paul Le Gall. All Rights Reserved.
* Licensed See LICENSE file in the project root for details.
*/

import type { ToggleProps } from '@ui/types/Toggle';

const sizeClasses = {
  sm: {
    track: 'w-8 h-4',
    thumb: 'w-3.5 h-3.5 translate-x-0.5 peer-checked:translate-x-3.5',
  },
  md: {
    track: 'w-11 h-6',
    thumb: 'w-5 h-5 translate-x-0.5 peer-checked:translate-x-4.5',
  },
  lg: {
    track: 'w-16 h-8',
    thumb: 'w-7 h-7 translate-x-0.5 peer-checked:translate-x-7.5',
  },
} as const;

const colorVariants = {
  primary: 'peer-checked:bg-blue-600',
  success: 'peer-checked:bg-green-500',
  danger: 'peer-checked:bg-red-500',
  warning: 'peer-checked:bg-yellow-500',
  neutral: 'peer-checked:bg-gray-500',
} as const;

type ToggleSize = keyof typeof sizeClasses;
type ToggleColorVariant = keyof typeof colorVariants;

export const Toggle = ({
  id,
  label,
  checked,
  onChange,
  className = '',
  disabled = false,
  colorVariant = 'primary',
  size = 'md',
  ...extraParameters
}: ToggleProps & {
  size?: ToggleSize;
  colorVariant?: ToggleColorVariant;
}) => {
  const currentSize = sizeClasses[size ?? 'md'];
  const activeColorClass = colorVariants[colorVariant ?? 'primary'];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className={`text-sm font-medium select-none ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer peer"
          {...extraParameters}
        />
        <div
          className={`
            ${currentSize.track} rounded-full
            bg-gray-300 dark:bg-gray-600
            ${activeColorClass}
            transition-colors duration-300 ease-in-out
            shadow-inner
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            pointer-events-none
          `}
        />
        <div
          className={`
            absolute top-0.5 left-0.5 bg-white rounded-full
            shadow-md transition-transform duration-300 ease-in-out
            ${currentSize.thumb}
            pointer-events-none
          `}
        />
      </div>
    </div>
  );
};
