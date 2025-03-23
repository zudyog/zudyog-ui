
import React, { useState, useRef, useEffect } from 'react';
import styles from './SpeedDial.module.css';

/**
 * Direction in which the speed dial actions should open
 */
export type SpeedDialDirection = 'up' | 'down' | 'left' | 'right';

/**
 * Individual action item for the SpeedDial component
 */
export interface SpeedDialAction {
  /** Unique identifier for the action */
  id: string;
  /** Icon element to display for the action */
  icon: React.ReactNode;
  /** Label text for the action tooltip */
  label: string;
  /** Function to execute when action is clicked */
  onClick: () => void;
  /** Optional class name for custom styling */
  className?: string;
  /** Optional disabled state */
  disabled?: boolean;
}

/**
 * Props for the SpeedDial component
 */
export interface SpeedDialProps {
  /** Array of action items to display when expanded */
  actions: SpeedDialAction[];
  /** Icon element to display on the main button */
  icon: React.ReactNode;
  /** Icon element to display when the speed dial is open */
  closeIcon?: React.ReactNode;
  /** Direction in which the actions should expand */
  direction?: SpeedDialDirection;
  /** Whether the speed dial is open by default */
  defaultOpen?: boolean;
  /** Whether to show tooltips for actions */
  withTooltip?: boolean;
  /** Whether to close the speed dial when an action is clicked */
  closeOnActionClick?: boolean;
  /** Optional class name for the main button */
  className?: string;
  /** Optional class name for the actions container */
  actionsClassName?: string;
  /** Optional ARIA label for the main button */
  ariaLabel?: string;
  /** Optional z-index for the component */
  zIndex?: number;
}

/**
 * SpeedDial component - A floating action button that expands to reveal related actions
 */
const SpeedDial: React.FC<SpeedDialProps> = ({
  actions,
  icon,
  closeIcon,
  direction = 'up',
  defaultOpen = false,
  withTooltip = true,
  closeOnActionClick = true,
  className = '',
  actionsClassName = '',
  ariaLabel = 'Speed Dial',
  zIndex = 10,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const speedDialRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the component to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (speedDialRef.current && !speedDialRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle the speed dial open/closed state
  const toggleSpeedDial = () => {
    setIsOpen(!isOpen);
  };

  // Handle action click
  const handleActionClick = (action: SpeedDialAction) => {
    if (action.disabled) return;
    
    action.onClick();
    if (closeOnActionClick) {
      setIsOpen(false);
    }
  };

  // Determine the container class based on direction
  const getContainerClass = () => {
    switch (direction) {
      case 'up':
        return styles.actionsUp;
      case 'down':
        return styles.actionsDown;
      case 'left':
        return styles.actionsLeft;
      case 'right':
        return styles.actionsRight;
      default:
        return styles.actionsUp;
    }
  };

  return (
    <div 
      className={styles.speedDial} 
      ref={speedDialRef}
      style={{ zIndex }}
    >
      {/* Main button */}
      <button
        type="button"
        className={`${styles.mainButton} ${className}`}
        onClick={toggleSpeedDial}
        aria-expanded={isOpen}
        aria-label={ariaLabel}
      >
        {isOpen && closeIcon ? closeIcon : icon}
      </button>

      {/* Actions container */}
      <div 
        className={`${styles.actionsContainer} ${getContainerClass()} ${actionsClassName} ${isOpen ? styles.open : ''}`}
        aria-hidden={!isOpen}
      >
        {actions.map((action) => (
          <div key={action.id} className={styles.actionWrapper}>
            <button
              type="button"
              className={`${styles.actionButton} ${action.className || ''} ${action.disabled ? styles.disabled : ''}`}
              onClick={() => handleActionClick(action)}
              disabled={action.disabled}
              aria-label={action.label}
            >
              {action.icon}
            </button>
            {withTooltip && (
              <span className={`${styles.tooltip} ${direction === 'left' ? styles.tooltipRight : styles.tooltipLeft}`}>
                {action.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpeedDial;
