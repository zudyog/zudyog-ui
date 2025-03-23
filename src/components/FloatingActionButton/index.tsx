

// FloatingActionButton.tsx
import React from 'react';
import styles from './FloatingActionButton.module.css';

/**
 * Position options for the floating action button
 */
export type FABPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

/**
 * Color variants for the floating action button
 */
export type FABColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

/**
 * Size variants for the floating action button
 */
export type FABSize = 'small' | 'medium' | 'large';

/**
 * Props for the FloatingActionButton component
 */
export interface FloatingActionButtonProps {
  /**
   * The icon to display inside the button
   */
  icon: React.ReactNode;

  /**
   * Optional label for extended FAB variant
   */
  label?: string;

  /**
   * Whether the FAB should be extended with a label
   */
  extended?: boolean;

  /**
   * The color variant of the button
   */
  color?: FABColor;

  /**
   * The size variant of the button
   */
  size?: FABSize;

  /**
   * The position of the button on the screen
   */
  position?: FABPosition;

  /**
   * Optional click handler
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Optional additional class names
   */
  className?: string;

  /**
   * Whether the button is disabled
   */
  disabled?: boolean;

  /**
   * Optional aria-label for accessibility
   */
  ariaLabel?: string;
}

/**
 * A floating action button (FAB) represents the primary action in an application.
 * It can be fixed to different corners of the screen and comes in different sizes and colors.
 */
const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  label,
  extended = false,
  color = 'primary',
  size = 'medium',
  position = 'bottom-right',
  onClick,
  className = '',
  disabled = false,
  ariaLabel,
}) => {
  // Combine all the class names
  const buttonClasses = [
    styles.fab,
    styles[`fab-${color}`],
    styles[`fab-${size}`],
    styles[`fab-${position}`],
    extended && styles['fab-extended'],
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || (label || 'Floating action button')}
      type="button"
    >
      {icon}
      {extended && label && <span className="ml-2">{label}</span>}
    </button>
  );
};

export default FloatingActionButton;