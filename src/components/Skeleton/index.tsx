
import React from 'react';
import styles from './Skeleton.module.css';

/**
 * Shape variants for the skeleton component
 */
export type SkeletonShape = 'rectangle' | 'circle' | 'text' | 'avatar' | 'button';

/**
 * Props for the Skeleton component
 */
export interface SkeletonProps {
  /**
   * Width of the skeleton
   * @default '100%'
   */
  width?: string | number;
  
  /**
   * Height of the skeleton
   * @default '16px'
   */
  height?: string | number;
  
  /**
   * Shape of the skeleton
   * @default 'rectangle'
   */
  shape?: SkeletonShape;
  
  /**
   * Whether to show animation
   * @default true
   */
  animate?: boolean;
  
  /**
   * Border radius for the skeleton
   * @default undefined
   */
  borderRadius?: string | number;
  
  /**
   * Additional CSS class names
   */
  className?: string;
  
  /**
   * Number of lines to render (only for text shape)
   * @default 1
   */
  lines?: number;
  
  /**
   * Gap between lines (only for text shape)
   * @default '0.5rem'
   */
  lineGap?: string | number;
}

/**
 * Skeleton component for displaying loading placeholders
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '16px',
  shape = 'rectangle',
  animate = true,
  borderRadius,
  className = '',
  lines = 1,
  lineGap = '0.5rem',
}) => {
  // Convert numeric values to pixel strings
  const widthValue = typeof width === 'number' ? `${width}px` : width;
  const heightValue = typeof height === 'number' ? `${height}px` : height;
  const borderRadiusValue = borderRadius 
    ? (typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius)
    : undefined;
  const lineGapValue = typeof lineGap === 'number' ? `${lineGap}px` : lineGap;

  // Determine styles based on shape
  const getShapeStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      width: widthValue,
      height: heightValue,
    };

    if (borderRadiusValue) {
      baseStyles.borderRadius = borderRadiusValue;
    }

    switch (shape) {
      case 'circle':
        return {
          ...baseStyles,
          borderRadius: '50%',
          aspectRatio: '1 / 1',
        };
      case 'avatar':
        return {
          ...baseStyles,
          borderRadius: '50%',
          width: heightValue, // Make width equal to height for perfect circle
        };
      case 'button':
        return {
          ...baseStyles,
          borderRadius: borderRadiusValue || '0.375rem',
        };
      case 'text':
        return {
          ...baseStyles,
          borderRadius: borderRadiusValue || '0.25rem',
        };
      default:
        return baseStyles;
    }
  };

  // Render multiple lines for text shape
  if (shape === 'text' && lines > 1) {
    return (
      <div className={`flex flex-col ${className}`} style={{ gap: lineGapValue }}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`bg-gray-200 ${animate ? styles.skeletonPulse : ''}`}
            style={{
              ...getShapeStyles(),
              width: index === lines - 1 && lines > 1 ? '80%' : widthValue,
            }}
          />
        ))}
      </div>
    );
  }

  // Render single skeleton
  return (
    <div
      className={`bg-gray-200 ${animate ? styles.skeletonPulse : ''} ${className}`}
      style={getShapeStyles()}
    />
  );
};

export default Skeleton;
