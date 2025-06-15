/*
* Copyright (c) 2025 Paul Le Gall. All Rights Reserved.
* Licensed See LICENSE file in the project root for details.
*/

import type React from 'react';

type ButtonType = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
};

export type Variant = 'primary' | 'warning' | 'success' | 'error' | 'danger';

export interface ButtonProps extends ButtonType {
  variant?: Variant;
}
