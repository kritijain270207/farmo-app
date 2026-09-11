'use client';

import type { ReactNode } from 'react';
import clsx from 'clsx';

/**
 * Page content container — mobile single column, desktop max-width 1280px.
 */
export function PageContainer({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={clsx(
        'w-full max-w-[1280px] mx-auto',
        padded && 'px-margin md:px-margin-tablet lg:px-margin-desktop pb-space-2xl pt-space-md',
        className,
      )}
    >
      {children}
    </div>
  );
}