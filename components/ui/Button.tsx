'use client';

import { forwardRef } from 'react';
import clsx from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'lg' | 'md' | 'sm' | 'block';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  icon?: ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-primary text-on-primary hover:bg-primary-container active:scale-[0.98] shadow-md focus-visible:ring-4 focus-visible:ring-secondary-fixed-dim',
  secondary:
    'bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-on-secondary active:scale-[0.98] shadow-md focus-visible:ring-4 focus-visible:ring-secondary-fixed-dim',
  outline:
    'bg-transparent border-2 border-primary text-primary hover:bg-primary-fixed/40 active:scale-[0.98] focus-visible:ring-4 focus-visible:ring-secondary-fixed-dim',
  ghost:
    'bg-transparent text-primary hover:bg-surface-container active:scale-[0.98]',
  danger:
    'bg-error text-on-error hover:bg-error-container hover:text-on-error-container active:scale-[0.98] shadow-md',
};

const sizeStyles: Record<Size, string> = {
  lg: 'h-14 px-6 text-label-lg rounded-lg',
  md: 'h-14 px-5 text-label-md rounded-lg',
  sm: 'h-12 px-4 text-label-sm rounded-lg',
  block: 'h-14 px-4 text-label-md rounded-lg w-full',
};

/**
 * Primary button — minimum 56px touch target on mobile (h-14).
 * Simple, tactile, thumb-friendly press states.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, icon, children, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(
        'inline-flex items-center justify-center gap-2 select-none transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none tap-highlight',
        variantStyles[variant],
        fullWidth ? sizeStyles.block : sizeStyles[size],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  ),
);

Button.displayName = 'Button';