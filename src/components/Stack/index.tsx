
import React, { ReactNode } from 'react';
import styles from './Stack.module.css';

/**
 * Alignment options for Stack items
 */
export type StackAlignment = 'start' | 'center' | 'end' | 'stretch';

/**
 * Orientation options for Stack layout
 */
export type StackOrientation = 'horizontal' | 'vertical';

/**
 * Spacing options for Stack items
 */
export type StackSpacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Props for the Stack component
 */
export interface StackProps {
  /** Child elements to be arranged in the stack */
  children: ReactNode;
  /** Direction of the stack layout */
  orientation?: StackOrientation;
  /** Spacing between stack items */
  spacing?: StackSpacing;
  /** Alignment of items within the stack */
  align?: StackAlignment;
  /** Whether to show dividers between items */
  dividers?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Whether the stack should take full width/height of its container */
  fullSize?: boolean;
  /** Whether items should wrap to next line (only applies to horizontal orientation) */
  wrap?: boolean;
}

/**
 * Stack component for one-dimensional layouts with consistent spacing
 * 
 * @example
 * <Stack orientation="horizontal" spacing="md" align="center" dividers>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </Stack>
 */
export const Stack: React.FC<StackProps> = ({
  children,
  orientation = 'vertical',
  spacing = 'md',
  align = 'start',
  dividers = false,
  className = '',
  fullSize = false,
  wrap = false,
}) => {
  // Convert React children to array for processing
  const childrenArray = React.Children.toArray(children).filter(Boolean);
  
  // Base classes for the stack container
  const baseClasses = [
    styles.stack,
    styles[`stack-${orientation}`],
    styles[`spacing-${spacing}`],
    styles[`align-${align}`],
    fullSize ? styles.fullSize : '',
    orientation === 'horizontal' && wrap ? styles.wrap : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={baseClasses}>
      {childrenArray.map((child, index) => (
        <React.Fragment key={index}>
          <div className={styles.stackItem}>{child}</div>
          {dividers && index < childrenArray.length - 1 && (
            <div 
              className={`${styles.divider} ${
                orientation === 'horizontal' 
                  ? styles.dividerVertical 
                  : styles.dividerHorizontal
              }`} 
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Stack;
