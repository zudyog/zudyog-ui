
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './Drawer.module.css';

/**
 * Drawer variant types
 * - temporary: Closes when clicking outside or pressing escape
 * - persistent: Stays open but can be closed via close button
 * - permanent: Always visible and cannot be closed
 */
export type DrawerVariant = 'temporary' | 'persistent' | 'permanent';

/**
 * Drawer anchor position
 */
export type DrawerAnchor = 'left' | 'right' | 'top' | 'bottom';

/**
 * Props for the Drawer component
 */
export interface DrawerProps {
  /** Controls whether the drawer is open */
  open: boolean;
  /** Function called when the drawer should close */
  onClose?: () => void;
  /** Content to be displayed inside the drawer */
  children: React.ReactNode;
  /** Position from which the drawer appears */
  anchor?: DrawerAnchor;
  /** Drawer behavior variant */
  variant?: DrawerVariant;
  /** Width of the drawer (for left/right anchors) */
  width?: string;
  /** Height of the drawer (for top/bottom anchors) */
  height?: string;
  /** Additional CSS class for the drawer */
  className?: string;
  /** Z-index for the drawer */
  zIndex?: number;
}

/**
 * Drawer component that slides in from the edge of the screen.
 * Supports temporary, persistent, and permanent variants.
 */
const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  children,
  anchor = 'left',
  variant = 'temporary',
  width = '300px',
  height = '300px',
  className = '',
  zIndex = 1000,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Handle click outside for temporary drawer
  useEffect(() => {
    if (variant !== 'temporary' || !open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose?.();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [variant, open, onClose]);

  // Determine drawer position styles
  const getPositionStyles = (): React.CSSProperties => {
    const style: React.CSSProperties = { zIndex };

    if (anchor === 'left' || anchor === 'right') {
      style.width = width;
      style.height = '100%';
    } else {
      style.height = height;
      style.width = '100%';
    }

    return style;
  };

  // Determine drawer class names
  const getDrawerClassNames = (): string => {
    const baseClasses = [
      styles.drawer,
      styles[`anchor-${anchor}`],
      styles[variant],
      open ? styles.open : '',
      className,
    ];

    return baseClasses.filter(Boolean).join(' ');
  };

  // For permanent variant, always render
  if (variant === 'permanent') {
    return (
      <div
        ref={drawerRef}
        className={getDrawerClassNames()}
        style={getPositionStyles()}
      >
        {children}
      </div>
    );
  }

  // TODO balaji hambeere
  // For temporary and persistent variants
  // if (!open && variant !== 'permanent') {
  //   return null;
  // }

  // Use portal for temporary drawers to avoid z-index issues
  const drawerContent = (
    <>
      {variant === 'temporary' && open && (
        <div className={styles.backdrop} onClick={onClose} />
      )}
      <div
        ref={drawerRef}
        className={getDrawerClassNames()}
        style={getPositionStyles()}
      >
        {variant === 'persistent' && (
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close drawer"
          >
            &times;
          </button>
        )}
        {children}
      </div>
    </>
  );

  return variant === 'temporary'
    ? createPortal(drawerContent, document.body)
    : drawerContent;
};

export default Drawer;
