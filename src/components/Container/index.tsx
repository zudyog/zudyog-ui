
import React from 'react';
import styles from './Container.module.css';

/**
 * Container props interface
 */
export interface ContainerProps {
  /** Container children */
  children: React.ReactNode;
  /** Whether the container should be fluid (full width) or fixed width with breakpoints */
  fluid?: boolean;
  /** Optional additional CSS classes */
  className?: string;
  /** Optional maximum width override */
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  /** Optional padding override */
  padding?: string;
  /** Optional data attributes */
  [dataAttribute: `data-${string}`]: string | undefined;
}

/**
 * Container component that provides responsive width constraints
 * 
 * @param {ContainerProps} props - The component props
 * @returns {JSX.Element} The Container component
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  fluid = false,
  className = '',
  maxWidth = '2xl',
  padding = 'px-4 sm:px-6 lg:px-8',
  ...rest
}) => {
  // Determine container width classes based on props
  const widthClasses = fluid 
    ? 'w-full' 
    : `mx-auto ${styles[`max-w-${maxWidth}`] || 'max-w-7xl'}`;

  return (
    <div 
      className={`${widthClasses} ${padding} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Container;
