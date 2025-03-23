
import React, { useEffect, useRef } from 'react';
import styles from './ClickAwayListener.module.css';

/**
 * Props for the ClickAwayListener component
 */
export interface ClickAwayListenerProps {
  /** The content to be rendered inside the click away listener */
  children: React.ReactNode;
  /** Function to be called when a click outside is detected */
  onClickAway: (event: MouseEvent | TouchEvent) => void;
  /** Whether the click away listener is disabled */
  disabled?: boolean;
  /** DOM events to listen for */
  events?: Array<'mousedown' | 'mouseup' | 'touchstart' | 'touchend'>;
  /** Additional CSS class names */
  className?: string;
  /** Whether to prevent the default behavior of the event */
  preventDefault?: boolean;
  /** Whether to stop propagation of the event */
  stopPropagation?: boolean;
}

/**
 * ClickAwayListener component that detects clicks outside of its children
 * 
 * @example
 * ```tsx
 * <ClickAwayListener onClickAway={() => setOpen(false)}>
 *   <div>This is a dropdown content</div>
 * </ClickAwayListener>
 * ```
 */
const ClickAwayListener: React.FC<ClickAwayListenerProps> = ({
  children,
  onClickAway,
  disabled = false,
  events = ['mousedown', 'touchstart'],
  className = '',
  preventDefault = false,
  stopPropagation = false,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) return undefined;

    const handleClickAway = (event: MouseEvent | TouchEvent) => {
      if (preventDefault) {
        event.preventDefault();
      }

      if (stopPropagation) {
        event.stopPropagation();
      }

      // Do nothing if the event was triggered by a click inside the component
      if (!rootRef.current) return;

      const target = event.target as Node;
      if (rootRef.current.contains(target)) return;

      onClickAway(event);
    };

    const registeredEvents: Array<{ type: string; handler: EventListener }> = [];

    events.forEach((eventName) => {
      document.addEventListener(eventName, handleClickAway);
      // TODO Balaji Hambeere
      // registeredEvents.push({
      //   type: eventName,
      //   handler: handleClickAway,
      // });
    });

    // Clean up event listeners on unmount
    return () => {
      registeredEvents.forEach(({ type, handler }) => {
        document.removeEventListener(type, handler);
      });
    };
  }, [onClickAway, disabled, events, preventDefault, stopPropagation]);

  return (
    <div ref={rootRef} className={`${styles.clickAwayListener} ${className}`}>
      {children}
    </div>
  );
};

export default ClickAwayListener;
