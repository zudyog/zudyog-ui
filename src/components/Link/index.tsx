
import React from 'react';
import styles from './Link.module.css';
import { twMerge } from 'tailwind-merge';

/**
 * Typography variants for the Link component
 */
export type LinkVariant =
  | 'body1'
  | 'body2'
  | 'subtitle1'
  | 'subtitle2'
  | 'caption'
  | 'button';

/**
 * Underline behavior options for the Link component
 */
export type UnderlineType =
  | 'none'
  | 'hover'
  | 'always';

/**
 * Props for the Link component
 */
export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** The URL the link points to */
  href: string;
  /** The content to be displayed within the link */
  children: React.ReactNode;
  /** Whether the link should open in a new tab */
  external?: boolean;
  /** Typography variant to apply to the link */
  variant?: LinkVariant;
  /** Controls when the underline should be displayed */
  underline?: UnderlineType;
  /** Additional CSS classes to apply to the link */
  className?: string;
  /** Whether the link is part of a navigation system */
  nav?: boolean;
  /** Whether the link is currently active (for navigation links) */
  active?: boolean;
  /** Optional click handler */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * Link component for navigation with customizable styling
 * 
 * @example
 * <Link href="/about" variant="body1" underline="hover">About Us</Link>
 * <Link href="https://example.com" external>External Link</Link>
 * <Link href="/dashboard" nav active>Dashboard</Link>
 */
export const Link: React.FC<LinkProps> = ({
  href,
  children,
  external = false,
  variant = 'body1',
  underline = 'hover',
  className = '',
  nav = false,
  active = false,
  onClick,
  ...rest
}) => {
  // Determine the base typography styles based on the variant
  const variantStyles = {
    body1: 'text-base font-normal',
    body2: 'text-sm font-normal',
    subtitle1: 'text-base font-medium',
    subtitle2: 'text-sm font-medium',
    caption: 'text-xs font-normal',
    button: 'text-sm font-medium uppercase tracking-wider',
  };

  // Determine the underline styles
  const underlineStyles = {
    none: 'no-underline',
    hover: styles.underlineHover,
    always: 'underline',
  };

  // External link attributes
  const externalProps = external ? {
    target: '_blank',
    rel: 'noopener noreferrer',
  } : {};

  // Navigation link styles
  const navStyles = nav ? 'px-3 py-2 rounded-md' : '';
  const activeStyles = active ? 'font-medium text-primary-600 dark:text-primary-400' : '';

  return (
    <a
      href={href}
      className={twMerge(
        'text-primary-600 dark:text-primary-400 transition-colors duration-200',
        variantStyles[variant],
        underlineStyles[underline],
        navStyles,
        activeStyles,
        className
      )}
      onClick={onClick}
      {...externalProps}
      {...rest}
    >
      {children}
    </a>
  );
};

export default Link;
