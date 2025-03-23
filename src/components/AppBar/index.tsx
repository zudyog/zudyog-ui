
import React, { useState, useEffect, ReactNode } from 'react';
import styles from './AppBar.module.css';

/**
 * Position options for the AppBar component
 */
export type AppBarPosition = 'fixed' | 'sticky' | 'static' | 'relative' | 'absolute';

/**
 * Elevation levels for the AppBar shadow
 */
export type AppBarElevation = 0 | 1 | 2 | 3 | 4;

/**
 * Props for the AppBar component
 */
export interface AppBarProps {
  /** The content of the AppBar */
  children: ReactNode;
  /** The position of the AppBar */
  position?: AppBarPosition;
  /** The color of the AppBar */
  color?: string;
  /** Whether the AppBar should change appearance on scroll */
  transformOnScroll?: boolean;
  /** The elevation level of the AppBar shadow */
  elevation?: AppBarElevation;
  /** Additional CSS class names */
  className?: string;
  /** Whether the AppBar should be transparent initially (when at top) */
  transparentAtTop?: boolean;
  /** Height of the AppBar in pixels */
  height?: number;
  /** Whether to show a bottom border */
  showBorder?: boolean;
}

/**
 * AppBar component for top navigation with scroll transformation capabilities
 * 
 * @example
 * ```tsx
 * <AppBar position="sticky" transformOnScroll transparentAtTop>
 *   <div className="flex justify-between items-center">
 *     <Logo />
 *     <Navigation />
 *   </div>
 * </AppBar>
 * ```
 */
export const AppBar: React.FC<AppBarProps> = ({
  children,
  position = 'fixed',
  color = 'bg-white dark:bg-gray-900',
  transformOnScroll = false,
  elevation = 0,
  className = '',
  transparentAtTop = false,
  height = 64,
  showBorder = false,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    if (!transformOnScroll && !transparentAtTop) return;

    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      const isAtTop = window.scrollY === 0;
      
      setScrolled(isScrolled);
      setAtTop(isAtTop);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [transformOnScroll, transparentAtTop]);

  const elevationClasses = [
    '',
    'shadow-sm',
    'shadow',
    'shadow-md',
    'shadow-lg',
  ];

  const getBackgroundColor = () => {
    if (transparentAtTop && atTop) {
      return 'bg-transparent';
    }
    return color;
  };

  return (
    <header
      className={`
        ${styles.appBar}
        ${getBackgroundColor()}
        ${position === 'fixed' ? 'fixed top-0 left-0 right-0 z-50' : ''}
        ${position === 'sticky' ? 'sticky top-0 z-50' : ''}
        ${position === 'static' ? 'static' : ''}
        ${position === 'relative' ? 'relative' : ''}
        ${position === 'absolute' ? 'absolute top-0 left-0 right-0' : ''}
        ${scrolled ? styles.scrolled : ''}
        ${elevationClasses[elevation]}
        ${showBorder ? 'border-b border-gray-200 dark:border-gray-700' : ''}
        ${className}
        transition-all duration-300 ease-in-out
      `}
      style={{ height: `${height}px` }}
    >
      <div className="container mx-auto px-4 h-full flex items-center">
        {children}
      </div>
    </header>
  );
};

export default AppBar;
