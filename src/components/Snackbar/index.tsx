
import React, { useEffect, useState } from 'react';
import styles from './Snackbar.module.css';

/**
 * Position options for the Snackbar component
 */
export type SnackbarPosition = 'bottom-left' | 'bottom-center' | 'bottom-right' | 'top-left' | 'top-center' | 'top-right';

/**
 * Variant options for the Snackbar component
 */
export type SnackbarVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

/**
 * Props for the Snackbar component
 */
export interface SnackbarProps {
  /** Whether the snackbar is open */
  open: boolean;
  /** Message to display in the snackbar */
  message: string;
  /** Function to call when the snackbar is closed */
  onClose: () => void;
  /** Auto-hide duration in milliseconds */
  autoHideDuration?: number;
  /** Position of the snackbar on the screen */
  position?: SnackbarPosition;
  /** Visual style variant of the snackbar */
  variant?: SnackbarVariant;
  /** Optional action button text */
  actionText?: string;
  /** Function to call when the action button is clicked */
  onActionClick?: () => void;
  /** Additional CSS class for the snackbar */
  className?: string;
}

/**
 * Snackbar component that displays brief messages about app processes
 * at the bottom of the screen with auto-hide, custom positioning, and action buttons.
 */
const Snackbar: React.FC<SnackbarProps> = ({
  open,
  message,
  onClose,
  autoHideDuration = 5000,
  position = 'bottom-center',
  variant = 'default',
  actionText,
  onActionClick,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      
      if (autoHideDuration !== null) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(onClose, 300); // Wait for exit animation to complete
        }, autoHideDuration);
        
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [open, autoHideDuration, onClose]);

  if (!open && !isVisible) {
    return null;
  }

  const positionClasses = {
    'bottom-left': 'left-4 bottom-4',
    'bottom-center': 'left-1/2 -translate-x-1/2 bottom-4',
    'bottom-right': 'right-4 bottom-4',
    'top-left': 'left-4 top-4',
    'top-center': 'left-1/2 -translate-x-1/2 top-4',
    'top-right': 'right-4 top-4',
  };

  const variantClasses = {
    default: 'bg-gray-800 text-white',
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white',
  };

  return (
    <div
      className={`
        fixed z-50 flex items-center min-w-[300px] max-w-md p-4 rounded-md shadow-lg
        ${positionClasses[position]}
        ${variantClasses[variant]}
        ${isVisible ? styles.snackbarEnter : styles.snackbarExit}
        ${className || ''}
      `}
      role="alert"
    >
      <div className="flex-grow mr-2">{message}</div>
      {actionText && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onActionClick) onActionClick();
          }}
          className="px-2 py-1 ml-2 text-sm font-medium uppercase transition-colors rounded hover:bg-white/20"
        >
          {actionText}
        </button>
      )}
      <button
        onClick={onClose}
        className="ml-2 text-white/80 hover:text-white transition-colors"
        aria-label="Close"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default Snackbar;
