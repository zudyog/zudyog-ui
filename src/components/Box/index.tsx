
import React from 'react';
import styles from './Box.module.css';

/**
 * CSS properties that can be passed as props to the Box component
 */
type CSSProperties = React.CSSProperties;

/**
 * Responsive prop types that can be passed as objects for different breakpoints
 */
type ResponsiveValue<T> = T | { sm?: T; md?: T; lg?: T; xl?: T; '2xl'?: T };

/**
 * Box component props interface
 * @typedef {Object} BoxProps
 */
export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Custom CSS properties */
  style?: CSSProperties;
  /** Element to render as (default: 'div') */
  as?: React.ElementType;
  /** Width of the box */
  width?: ResponsiveValue<string | number>;
  /** Height of the box */
  height?: ResponsiveValue<string | number>;
  /** Margin on all sides */
  m?: ResponsiveValue<string | number>;
  /** Margin top */
  mt?: ResponsiveValue<string | number>;
  /** Margin right */
  mr?: ResponsiveValue<string | number>;
  /** Margin bottom */
  mb?: ResponsiveValue<string | number>;
  /** Margin left */
  ml?: ResponsiveValue<string | number>;
  /** Margin horizontal (left and right) */
  mx?: ResponsiveValue<string | number>;
  /** Margin vertical (top and bottom) */
  my?: ResponsiveValue<string | number>;
  /** Padding on all sides */
  p?: ResponsiveValue<string | number>;
  /** Padding top */
  pt?: ResponsiveValue<string | number>;
  /** Padding right */
  pr?: ResponsiveValue<string | number>;
  /** Padding bottom */
  pb?: ResponsiveValue<string | number>;
  /** Padding left */
  pl?: ResponsiveValue<string | number>;
  /** Padding horizontal (left and right) */
  px?: ResponsiveValue<string | number>;
  /** Padding vertical (top and bottom) */
  py?: ResponsiveValue<string | number>;
  /** Background color */
  bg?: string;
  /** Text color */
  color?: string;
  /** Border radius */
  borderRadius?: ResponsiveValue<string | number>;
  /** Display property */
  display?: ResponsiveValue<'block' | 'inline' | 'inline-block' | 'flex' | 'inline-flex' | 'grid' | 'none'>;
  /** Flex direction */
  flexDirection?: ResponsiveValue<'row' | 'row-reverse' | 'column' | 'column-reverse'>;
  /** Justify content */
  justifyContent?: ResponsiveValue<'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'>;
  /** Align items */
  alignItems?: ResponsiveValue<'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'>;
  /** Flex wrap */
  flexWrap?: ResponsiveValue<'nowrap' | 'wrap' | 'wrap-reverse'>;
  /** Flex grow */
  flexGrow?: ResponsiveValue<number>;
  /** Flex shrink */
  flexShrink?: ResponsiveValue<number>;
  /** Position */
  position?: ResponsiveValue<'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'>;
  /** Box shadow */
  boxShadow?: string;
  /** Z-index */
  zIndex?: number;
  /** Overflow */
  overflow?: ResponsiveValue<'visible' | 'hidden' | 'scroll' | 'auto'>;
  /** Children elements */
  children?: React.ReactNode;
}

/**
 * Box component - A utility component that wraps elements with custom styling props
 * 
 * @param {BoxProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export const Box: React.FC<BoxProps> = ({
  as: Component = 'div',
  style,
  width,
  height,
  m,
  mt,
  mr,
  mb,
  ml,
  mx,
  my,
  p,
  pt,
  pr,
  pb,
  pl,
  px,
  py,
  bg,
  color,
  borderRadius,
  display,
  flexDirection,
  justifyContent,
  alignItems,
  flexWrap,
  flexGrow,
  flexShrink,
  position,
  boxShadow,
  zIndex,
  overflow,
  children,
  className,
  ...rest
}) => {
  // Process responsive values
  const processResponsiveValue = (value: ResponsiveValue<any> | undefined): string => {
    if (value === undefined) return '';
    
    if (typeof value === 'object') {
      const classes = [];
      if (value.sm) classes.push(`sm:${value.sm}`);
      if (value.md) classes.push(`md:${value.md}`);
      if (value.lg) classes.push(`lg:${value.lg}`);
      if (value.xl) classes.push(`xl:${value.xl}`);
      if (value['2xl']) classes.push(`2xl:${value['2xl']}`);
      return classes.join(' ');
    }
    
    return String(value);
  };

  // Build Tailwind classes
  const tailwindClasses = [
    className || '',
    width ? `w-${processResponsiveValue(width)}` : '',
    height ? `h-${processResponsiveValue(height)}` : '',
    m ? `m-${processResponsiveValue(m)}` : '',
    mt ? `mt-${processResponsiveValue(mt)}` : '',
    mr ? `mr-${processResponsiveValue(mr)}` : '',
    mb ? `mb-${processResponsiveValue(mb)}` : '',
    ml ? `ml-${processResponsiveValue(ml)}` : '',
    mx ? `mx-${processResponsiveValue(mx)}` : '',
    my ? `my-${processResponsiveValue(my)}` : '',
    p ? `p-${processResponsiveValue(p)}` : '',
    pt ? `pt-${processResponsiveValue(pt)}` : '',
    pr ? `pr-${processResponsiveValue(pr)}` : '',
    pb ? `pb-${processResponsiveValue(pb)}` : '',
    pl ? `pl-${processResponsiveValue(pl)}` : '',
    px ? `px-${processResponsiveValue(px)}` : '',
    py ? `py-${processResponsiveValue(py)}` : '',
    bg ? `bg-${bg}` : '',
    color ? `text-${color}` : '',
    borderRadius ? `rounded-${processResponsiveValue(borderRadius)}` : '',
    display ? `${processResponsiveValue(display)}` : '',
    flexDirection ? `flex-${processResponsiveValue(flexDirection)}` : '',
    justifyContent ? `justify-${processResponsiveValue(justifyContent)}` : '',
    alignItems ? `items-${processResponsiveValue(alignItems)}` : '',
    flexWrap ? `flex-${processResponsiveValue(flexWrap)}` : '',
    flexGrow !== undefined ? `flex-grow-${processResponsiveValue(flexGrow)}` : '',
    flexShrink !== undefined ? `flex-shrink-${processResponsiveValue(flexShrink)}` : '',
    position ? `${processResponsiveValue(position)}` : '',
    boxShadow ? `shadow-${boxShadow}` : '',
    zIndex !== undefined ? `z-${zIndex}` : '',
    overflow ? `overflow-${processResponsiveValue(overflow)}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component 
      className={`${styles.box} ${tailwindClasses}`}
      style={style}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default Box;
