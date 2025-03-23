
import React, { useState } from 'react';
import styles from './Rating.module.css';

/**
 * Props for the Rating component
 */
export interface RatingProps {
  /** Maximum rating value (number of stars) */
  max?: number;
  /** Current rating value */
  value?: number;
  /** Precision of rating (1 = whole stars, 0.5 = half stars, etc.) */
  precision?: number;
  /** Size of stars in pixels */
  size?: number;
  /** Color of active stars */
  activeColor?: string;
  /** Color of inactive stars */
  inactiveColor?: string;
  /** Whether the rating can be changed by the user */
  readOnly?: boolean;
  /** Callback when rating changes */
  onChange?: (value: number) => void;
  /** Optional CSS class name */
  className?: string;
}

/**
 * A customizable star rating component
 * 
 * @example
 * <Rating 
 *   value={3.5} 
 *   max={5} 
 *   precision={0.5} 
 *   onChange={(value) => console.log(`New rating: ${value}`)} 
 * />
 */
export const Rating: React.FC<RatingProps> = ({
  max = 5,
  value = 0,
  precision = 1,
  size = 24,
  activeColor = '#FFC107',
  inactiveColor = '#E0E0E0',
  readOnly = false,
  onChange,
  className = '',
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  
  // Calculate the array of stars to display
  const starsArray = Array.from({ length: max }, (_, index) => index + 1);

  /**
   * Rounds the value to the nearest precision
   */
  const roundToNearest = (value: number): number => {
    const rounded = Math.round(value / precision) * precision;
    return Math.min(max, Math.max(0, rounded));
  };

  /**
   * Handles mouse move over a star
   */
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (readOnly) return;
    
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const percent = (event.clientX - left) / width;
    const starValue = index + percent;
    
    setHoverValue(roundToNearest(starValue));
  };

  /**
   * Handles mouse leave from the rating component
   */
  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverValue(null);
  };

  /**
   * Handles click on a star
   */
  const handleClick = () => {
    if (readOnly || !hoverValue || !onChange) return;
    onChange(hoverValue);
  };

  /**
   * Calculates the fill percentage for a star
   */
  const getFillPercentage = (starIndex: number): number => {
    const currentValue = hoverValue !== null ? hoverValue : value;
    
    if (currentValue >= starIndex) {
      return 100;
    } else if (currentValue + 1 <= starIndex) {
      return 0;
    } else {
      return (currentValue - Math.floor(currentValue)) * 100;
    }
  };

  return (
    <div 
      className={`${styles.ratingContainer} ${className} inline-flex`}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: readOnly ? 'default' : 'pointer' }}
    >
      {starsArray.map((starIndex) => {
        const fillPercentage = getFillPercentage(starIndex);
        
        return (
          <div
            key={starIndex}
            className={styles.starContainer}
            style={{ width: `${size}px`, height: `${size}px` }}
            onMouseMove={(e) => handleMouseMove(e, starIndex - 1)}
            onClick={handleClick}
          >
            <div className={styles.starBackground} style={{ color: inactiveColor }}>
              ★
            </div>
            <div 
              className={styles.starForeground} 
              style={{ 
                color: activeColor,
                clipPath: `inset(0 ${100 - fillPercentage}% 0 0)`,
              }}
            >
              ★
            </div>
          </div>
        );
      })}
      {!readOnly && onChange && (
        <span className="ml-2 text-sm text-gray-600">
          {hoverValue !== null ? hoverValue : value}
        </span>
      )}
    </div>
  );
};

export default Rating;
