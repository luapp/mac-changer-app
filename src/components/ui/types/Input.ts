/*
* Copyright (c) 2025 Paul Le Gall. All Rights Reserved.
* Licensed See LICENSE file in the project root for details.
*/

import type React from 'react';

export type InputVariant = "primary";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  className?: string;
}
