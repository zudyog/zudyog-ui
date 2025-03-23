
import React, { ReactNode } from 'react';
import styles from './Card.module.css';

/**
 * Elevation levels for the card component
 */
export type CardElevation = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Border styles for the card component
 */
export type CardBorder = 'none' | 'rounded' | 'circular';

/**
 * Props for the Card component
 */
export interface CardProps {
  /**
   * The header content of the card
   */
  header?: ReactNode;
  
  /**
   * The main content of the card
   */
  children: ReactNode;
  
  /**
   * Optional media element to display (image, video, etc.)
   */
  media?: ReactNode;
  
  /**
   * Actions to display at the bottom of the card
   */
  actions?: ReactNode;
  
  /**
   * Elevation level of the card (0-5)
   * @default 1
   */
  elevation?: CardElevation;
  
  /**
   * Border style of the card
   * @default 'rounded'
   */
  border?: CardBorder;
  
  /**
   * Additional CSS class names
   */
  className?: string;
  
  /**
   * Whether the card should take full width of its container
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Whether the card should have hover effects
   * @default true
   */
  hoverable?: boolean;
  
  /**
   * Click handler for the card
   */
  onClick?: () => void;
}

/**
 * Card component - A flexible surface container with header, content, media, and action sections
 */
export const Card: React.FC<CardProps> = ({
  header,
  children,
  media,
  actions,
  elevation = 1,
  border = 'rounded',
  className = '',
  fullWidth = false,
  hoverable = true,
  onClick,
}) => {
  // Determine the elevation class based on the elevation prop
  const elevationClass = styles[`elevation${elevation}`];
  
  // Determine the border class based on the border prop
  const borderClass = {
    'none': '',
    'rounded': 'rounded-lg',
    'circular': 'rounded-full',
  }[border];
  
  // Determine if the card is clickable
  const isClickable = !!onClick;
  
  return (
    <div 
      className={`
        ${styles.card}
        ${elevationClass}
        ${borderClass}
        ${fullWidth ? 'w-full' : ''}
        ${hoverable ? styles.hoverable : ''}
        ${isClickable ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {header && (
        <div className={styles.cardHeader}>
          {header}
        </div>
      )}
      
      {media && (
        <div className={styles.cardMedia}>
          {media}
        </div>
      )}
      
      <div className={styles.cardContent}>
        {children}
      </div>
      
      {actions && (
        <div className={styles.cardActions}>
          {actions}
        </div>
      )}
    </div>
  );
};

export default Card;
