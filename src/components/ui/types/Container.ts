/*
* Copyright (c) 2025 Paul Le Gall. All Rights Reserved.
* Licensed See LICENSE file in the project root for details.
*/

import type React from 'react';

export type Variant = 'primary' | 'warning' | 'success' | 'error' | 'danger';

type BaseContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export interface ContainerProps extends BaseContainerProps {
  variant?: Variant;
  [key: string]: any;
}
