
import React, { useState, useRef, useEffect } from 'react';
import styles from './Tooltip.module.css';

/**
 * Position options for the tooltip
 */
export type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

/**
 * Props for the Tooltip component
 */
export interface TooltipProps {
  /** The content to display inside the tooltip */
  content: React.ReactNode;
  /** The element that triggers the tooltip */
  children: React.ReactNode;
  /** The position of the tooltip relative to the trigger element */
  position?: TooltipPosition;
  /** Whether to show an arrow pointing to the trigger element */
  showArrow?: boolean;
  /** Additional CSS class for the tooltip */
  className?: string;
  /** Delay before showing the tooltip (in ms) */
  delay?: number;
  /** Whether the tooltip is disabled */
  disabled?: boolean;
  /** Maximum width of the tooltip */
  maxWidth?: number;
}

/**
 * Tooltip component that displays informative text when users hover over, focus on, or tap an element.
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  showArrow = true,
  className = '',
  delay = 300,
  disabled = false,
  maxWidth = 250,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    if (disabled) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible || !tooltipRef.current || !triggerRef.current) return;

    const tooltipElement = tooltipRef.current;
    const triggerElement = triggerRef.current;
    const triggerRect = triggerElement.getBoundingClientRect();

    // Reset any previous positioning
    tooltipElement.style.top = '';
    tooltipElement.style.right = '';
    tooltipElement.style.bottom = '';
    tooltipElement.style.left = '';

    const tooltipRect = tooltipElement.getBoundingClientRect();
    const spacing = 8; // Space between tooltip and trigger element

    switch (position) {
      case 'top':
        tooltipElement.style.bottom = `${window.innerHeight - triggerRect.top + spacing}px`;
        tooltipElement.style.left = `${triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2}px`;
        break;
      case 'right':
        tooltipElement.style.left = `${triggerRect.right + spacing}px`;
        tooltipElement.style.top = `${triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2}px`;
        break;
      case 'bottom':
        tooltipElement.style.top = `${triggerRect.bottom + spacing}px`;
        tooltipElement.style.left = `${triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2}px`;
        break;
      case 'left':
        tooltipElement.style.right = `${window.innerWidth - triggerRect.left + spacing}px`;
        tooltipElement.style.top = `${triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2}px`;
        break;
    }
  }, [isVisible, position]);

  const positionClass = styles[`tooltip-${position}`];
  const arrowClass = showArrow ? styles[`arrow-${position}`] : '';

  return (
    <div className={styles.tooltipContainer}>
      <div
        ref={triggerRef}
        className={styles.tooltipTrigger}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`${styles.tooltip} ${positionClass} ${arrowClass} ${className}`}
          style={{ maxWidth: `${maxWidth}px` }}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
