
import React from 'react';
import styles from './Divider.module.css';

/**
 * Orientation options for the divider
 */
export type DividerOrientation = 'horizontal' | 'vertical';

/**
 * Visual style variants for the divider
 */
export type DividerVariant = 'solid' | 'dashed' | 'dotted';

/**
 * Props for the Divider component
 */
export interface DividerProps {
  /** Orientation of the divider */
  orientation?: DividerOrientation;
  /** Visual style variant */
  variant?: DividerVariant;
  /** Optional text to display in the middle of the divider */
  children?: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Color of the divider (defaults to current text color with opacity) */
  color?: string;
  /** Thickness of the divider in pixels */
  thickness?: number;
  /** Spacing around the divider in pixels */
  spacing?: number;
}

/**
 * A divider component that separates content with a line.
 * Can be oriented horizontally or vertically, with optional text.
 */
export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'solid',
  children,
  className = '',
  color,
  thickness = 1,
  spacing = 16,
}) => {
  const isHorizontal = orientation === 'horizontal';
  
  // Construct the base divider classes
  const dividerClasses = [
    styles.divider,
    styles[orientation],
    styles[variant],
    className
  ].filter(Boolean).join(' ');
  
  // Style object for custom properties
  const dividerStyle: React.CSSProperties = {
    '--divider-color': color,
    '--divider-thickness': `${thickness}px`,
    '--divider-spacing': `${spacing}px`,
  } as React.CSSProperties;

  // If there's text/children, render a divider with text
  if (children) {
    return (
      <div className={`${dividerClasses} ${styles.withText}`} style={dividerStyle}>
        {isHorizontal ? (
          <>
            <div className={styles.line} />
            <span className={styles.text}>{children}</span>
            <div className={styles.line} />
          </>
        ) : (
          <>
            <div className={styles.line} />
            <span className={styles.text}>{children}</span>
            <div className={styles.line} />
          </>
        )}
      </div>
    );
  }
  
  // Simple divider without text
  return <div className={dividerClasses} style={dividerStyle} />;
};

export default Divider;
