
import React, { ReactNode } from 'react';
import styles from './Grid.module.css';

/**
 * Alignment options for grid items along the main axis
 */
export type GridJustify = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';

/**
 * Alignment options for grid items along the cross axis
 */
export type GridAlign = 'start' | 'end' | 'center' | 'stretch' | 'baseline';

/**
 * Available spacing options between grid items
 */
export type GridGap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;

/**
 * Responsive column configuration
 */
export type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'none';

/**
 * Grid component props interface
 */
export interface GridProps {
  /** Child elements to render within the grid */
  children: ReactNode;
  /** Number of columns at different breakpoints */
  cols?: GridCols;
  /** Number of columns on small screens (640px and up) */
  colsSm?: GridCols;
  /** Number of columns on medium screens (768px and up) */
  colsMd?: GridCols;
  /** Number of columns on large screens (1024px and up) */
  colsLg?: GridCols;
  /** Number of columns on extra large screens (1280px and up) */
  colsXl?: GridCols;
  /** Number of columns on 2xl screens (1536px and up) */
  cols2xl?: GridCols;
  /** Gap between grid items */
  gap?: GridGap;
  /** Horizontal gap between grid items */
  gapX?: GridGap;
  /** Vertical gap between grid items */
  gapY?: GridGap;
  /** Horizontal alignment of grid items */
  justifyItems?: GridAlign;
  /** Vertical alignment of grid items */
  alignItems?: GridAlign;
  /** Distribution of space between grid items (horizontal) */
  justifyContent?: GridJustify;
  /** Distribution of space between grid items (vertical) */
  alignContent?: GridJustify;
  /** Additional CSS class names */
  className?: string;
  /** Flow direction of the grid (row or column) */
  flow?: 'row' | 'col' | 'dense' | 'row-dense' | 'col-dense';
  /** Whether the grid should take up the full height of its container */
  fullHeight?: boolean;
  /** Whether the grid should take up the full width of its container */
  fullWidth?: boolean;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * A responsive grid layout component based on CSS Grid.
 * Provides flexible options for creating two-dimensional layouts with support for
 * spacing, alignment, and responsive breakpoints.
 */
export const Grid: React.FC<GridProps> = ({
  children,
  cols = 12,
  colsSm,
  colsMd,
  colsLg,
  colsXl,
  cols2xl,
  gap = 4,
  gapX,
  gapY,
  justifyItems,
  alignItems,
  justifyContent,
  alignContent,
  className = '',
  flow,
  fullHeight = false,
  fullWidth = true,
  style,
}) => {
  // Build the grid template columns class
  const getColsClass = (cols: GridCols, prefix = '') => {
    if (cols === 'none') return `${prefix}grid-cols-none`;
    return `${prefix}grid-cols-${cols}`;
  };

  // Build the class names for the grid
  const gridClasses = [
    'grid',
    getColsClass(cols),
    colsSm && getColsClass(colsSm, 'sm:'),
    colsMd && getColsClass(colsMd, 'md:'),
    colsLg && getColsClass(colsLg, 'lg:'),
    colsXl && getColsClass(colsXl, 'xl:'),
    cols2xl && getColsClass(cols2xl, '2xl:'),
    gapX !== undefined ? `gap-x-${gapX}` : gap !== undefined ? `gap-x-${gap}` : '',
    gapY !== undefined ? `gap-y-${gapY}` : gap !== undefined ? `gap-y-${gap}` : '',
    justifyItems && `justify-items-${justifyItems}`,
    alignItems && `items-${alignItems}`,
    justifyContent && `justify-${justifyContent}`,
    alignContent && `content-${alignContent}`,
    flow && `grid-flow-${flow}`,
    fullHeight && 'h-full',
    fullWidth && 'w-full',
    className,
    styles.grid
  ].filter(Boolean).join(' ');

  return (
    <div className={gridClasses} style={style}>
      {children}
    </div>
  );
};

export default Grid;
