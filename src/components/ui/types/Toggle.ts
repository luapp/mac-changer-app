/*
* Copyright (c) 2025 Paul Le Gall. All Rights Reserved.
* Licensed See LICENSE file in the project root for details.
*/

import type React from 'react';

export interface ToggleProps {
  id: string;
  label?: React.ReactNode;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  colorVariant?: string;
  size?: 'sm' | 'md' | 'lg';
  [key: string]: any;
}
