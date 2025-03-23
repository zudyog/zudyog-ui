
import React, { useEffect, useRef } from 'react';
import styles from './Dialog.module.css';

/**
 * Dialog size options
 */
export type DialogSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Props for the Dialog component
 */
export interface DialogProps {
  /** Controls whether the dialog is displayed */
  isOpen: boolean;
  /** Function called when the dialog should close */
  onClose: () => void;
  /** Dialog title displayed in the header */
  title?: React.ReactNode;
  /** Content to display in the dialog body */
  children: React.ReactNode;
  /** Actions/buttons to display in the footer */
  actions?: React.ReactNode;
  /** Size of the dialog */
  size?: DialogSize;
  /** Whether to show a close button in the header */
  showCloseButton?: boolean;
  /** Whether clicking the backdrop should close the dialog */
  closeOnBackdropClick?: boolean;
  /** Additional CSS class for the dialog container */
  className?: string;
  /** Whether to disable scrolling on the body when dialog is open */
  disableBodyScroll?: boolean;
}

/**
 * Dialog component that displays a modal window over the page content
 */
const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  className = '',
  disableBodyScroll = true,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Handle ESC key press to close dialog
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // Handle body scroll locking
  useEffect(() => {
    if (disableBodyScroll) {
      if (isOpen) {
        document.body.classList.add(styles.bodyLock);
      } else {
        document.body.classList.remove(styles.bodyLock);
      }
    }

    return () => {
      if (disableBodyScroll) {
        document.body.classList.remove(styles.bodyLock);
      }
    };
  }, [isOpen, disableBodyScroll]);

  // Focus trap inside dialog
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      onClose();
    }
  };

  const sizeClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  };

  return (
    <div 
      className={`${styles.backdrop} fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4`}
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={dialogRef}
        className={`${styles.dialog} ${sizeClasses[size]} w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl transform transition-all ${className}`}
        tabIndex={-1}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {title}
            </h3>
            {showCloseButton && (
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                onClick={onClose}
                aria-label="Close"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        
        <div className={`${styles.dialogContent} px-6 py-4 max-h-[70vh] overflow-y-auto`}>
          {children}
        </div>
        
        {actions && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dialog;
