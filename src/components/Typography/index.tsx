
import React from 'react';
import styles from './Typography.module.css';
import clsx from 'clsx';

/**
 * Available typography variants
 */
export type TypographyVariant = 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'h4' 
  | 'h5' 
  | 'h6' 
  | 'subtitle1' 
  | 'subtitle2' 
  | 'body1' 
  | 'body2' 
  | 'caption' 
  | 'overline';

/**
 * Available text alignment options
 */
export type TextAlign = 'left' | 'center' | 'right' | 'justify';

/**
 * Available font weight options
 */
export type FontWeight = 'normal' | 'medium' | 'semibold' | 'bold';

/**
 * Props for the Typography component
 */
export interface TypographyProps {
  /** The variant of the typography component */
  variant?: TypographyVariant;
  /** The content to be displayed */
  children: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Text alignment */
  align?: TextAlign;
  /** Font weight */
  weight?: FontWeight;
  /** Whether to apply gutterBottom margin */
  gutterBottom?: boolean;
  /** Whether to truncate text with ellipsis */
  truncate?: boolean;
  /** Whether to apply responsive font sizing */
  responsive?: boolean;
  /** HTML element to render (overrides the default element for the variant) */
  component?: React.ElementType;
  /** Optional color override */
  color?: string;
}

/**
 * Typography component for consistent text styling throughout the application
 * 
 * @example
 * <Typography variant="h1" align="center" gutterBottom>
 *   Hello World
 * </Typography>
 */
export const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  children,
  className,
  align = 'left',
  weight,
  gutterBottom = false,
  truncate = false,
  responsive = true,
  component,
  color,
  ...rest
}) => {
  // Map variants to default HTML elements
  const variantElementMap: Record<TypographyVariant, React.ElementType> = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    subtitle1: 'h6',
    subtitle2: 'h6',
    body1: 'p',
    body2: 'p',
    caption: 'span',
    overline: 'span'
  };

  // Determine the component to render
  const Component = component || variantElementMap[variant];

  // Build class names
  const classes = clsx(
    styles.typography,
    styles[variant],
    styles[`align-${align}`],
    weight && styles[`weight-${weight}`],
    gutterBottom && styles.gutterBottom,
    truncate && styles.truncate,
    responsive && styles.responsive,
    className
  );

  // Custom style for color override
  const customStyle = color ? { color } : undefined;

  return (
    <Component className={classes} style={customStyle} {...rest}>
      {children}
    </Component>
  );
};

export default Typography;
