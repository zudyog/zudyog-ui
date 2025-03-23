
import React, { forwardRef } from 'react';
import styles from './Paper.module.css';
import clsx from 'clsx';

/**
 * Elevation levels for the Paper component (0-24)
 */
export type PaperElevation = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
  13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24;

/**
 * Props for the Paper component
 */
export interface PaperProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content of the component
   */
  children?: React.ReactNode;

  /**
   * The component used for the root node
   * @default 'div'
   */
  component?: React.ElementType;

  /**
   * Shadow depth, corresponds to `dp` in the spec
   * @default 1
   */
  elevation?: PaperElevation;

  /**
   * If true, rounded corners are disabled
   * @default false
   */
  square?: boolean;

  /**
   * The variant to use
   * @default 'elevation'
   */
  variant?: 'elevation' | 'outlined';

  /**
   * Background color of the Paper
   * @default 'white'
   */
  bgColor?: string;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * Paper is a physical-like surface that serves as a foundation for most components.
 * It provides elevation, square/rounded variants, and customizable background colors.
 */
export const Paper = forwardRef<HTMLDivElement, PaperProps>(function Paper(
  {
    children,
    component: Component = 'div',
    elevation = 1,
    square = false,
    variant = 'elevation',
    bgColor = 'white',
    className,
    ...other
  },
  ref
) {
  const elevationClass = variant === 'elevation' ? styles[`elevation${elevation}`] : '';

  return (
    <Component
      className={clsx(
        styles.root,
        elevationClass,
        {
          [styles.rounded]: !square,
          [styles.outlined]: variant === 'outlined',
        },
        className
      )}
      ref={ref}
      style={{ backgroundColor: bgColor }}
      {...other}
    >
      {children}
    </Component>
  );
});

export default Paper;
