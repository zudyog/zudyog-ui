
import React, { useEffect } from 'react';
import styles from './Backdrop.module.css';

/**
 * Props for the Backdrop component
 */
export interface BackdropProps {
  /** Whether the backdrop is visible */
  isVisible: boolean;
  /** Opacity value between 0 and 1 */
  opacity?: number;
  /** Background color (Tailwind class name without the 'bg-' prefix) */
  color?: string;
  /** Z-index value */
  zIndex?: number;
  /** Callback function when backdrop is clicked */
  onClick?: () => void;
  /** Whether to prevent scrolling when backdrop is visible */
  preventScroll?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Children to render on top of the backdrop */
  children?: React.ReactNode;
}

/**
 * Backdrop component that creates a full-screen overlay
 * 
 * @example
 * <Backdrop isVisible={true} opacity={0.7} onClick={handleClose}>
 *   <div>Modal content</div>
 * </Backdrop>
 */
const Backdrop: React.FC<BackdropProps> = ({
  isVisible,
  opacity = 0.5,
  color = 'black',
  zIndex = 40,
  onClick,
  preventScroll = true,
  className = '',
  children,
}) => {
  useEffect(() => {
    if (preventScroll) {
      if (isVisible) {
        document.body.classList.add(styles.noScroll);
      } else {
        document.body.classList.remove(styles.noScroll);
      }
    }

    return () => {
      if (preventScroll) {
        document.body.classList.remove(styles.noScroll);
      }
    };
  }, [isVisible, preventScroll]);

  if (!isVisible) return null;

  const opacityClass = `bg-opacity-${Math.round(opacity * 100)}`;
  const backgroundClass = `bg-${color}`;

  return (
    <div
      className={`
        fixed inset-0 flex items-center justify-center
        ${backgroundClass} ${opacityClass}
        transition-opacity duration-300 ease-in-out
        ${styles.backdrop}
        ${className}
      `}
      style={{ zIndex }}
      onClick={onClick}
      data-testid="backdrop"
    >
      {children && (
        <div onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      )}
    </div>
  );
};

export default Backdrop;
