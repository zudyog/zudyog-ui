
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

/**
 * Props for the Modal component
 */
export interface ModalProps {
  /** Controls whether the modal is displayed */
  isOpen: boolean;
  /** Called when the modal should close */
  onClose: () => void;
  /** The content to display inside the modal */
  children: React.ReactNode;
  /** Title of the modal displayed in the header */
  title?: string;
  /** Whether to show a close button in the header */
  showCloseButton?: boolean;
  /** Whether to close the modal when clicking the backdrop */
  closeOnBackdropClick?: boolean;
  /** Whether to close the modal when pressing Escape key */
  closeOnEsc?: boolean;
  /** Additional CSS class for the modal container */
  className?: string;
  /** Width of the modal (default, sm, md, lg, xl, full) */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Whether to center the modal vertically */
  centered?: boolean;
  /** Whether to show a backdrop behind the modal */
  hasBackdrop?: boolean;
  /** Additional CSS class for the backdrop */
  backdropClassName?: string;
  /** ID for the modal element */
  id?: string;
}

/**
 * Modal component for creating dialogs, popovers, and other overlay elements.
 * Supports backdrop, focus management, and keyboard navigation.
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEsc = true,
  className = '',
  size = 'md',
  centered = true,
  hasBackdrop = true,
  backdropClassName = '',
  id,
}) => {
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  // Handle mounting
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      
      // Focus the modal when it opens
      if (modalRef.current) {
        modalRef.current.focus();
      }
      
      // Prevent body scrolling
      document.body.classList.add('overflow-hidden');
    } else {
      // Restore focus when modal closes
      if (previousActiveElement.current && 'focus' in previousActiveElement.current) {
        (previousActiveElement.current as HTMLElement).focus();
      }
      
      // Restore body scrolling
      document.body.classList.remove('overflow-hidden');
    }
  }, [isOpen]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      // Close on Escape key press
      if (closeOnEsc && event.key === 'Escape') {
        onClose();
      }
      
      // Trap focus within modal
      if (event.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        
        if (event.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeOnEsc, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full',
  }[size];

  // Don't render if not mounted or not open
  if (!mounted || !isOpen) {
    return null;
  }

  const modalContent = (
    <div
      className={`fixed inset-0 z-50 flex ${centered ? 'items-center' : 'items-start pt-10'} justify-center overflow-y-auto`}
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? `${id || 'modal'}-title` : undefined}
    >
      {/* Backdrop */}
      {hasBackdrop && (
        <div 
          className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity ${styles.backdrop} ${backdropClassName}`}
          aria-hidden="true"
        />
      )}
      
      {/* Modal panel */}
      <div
        ref={modalRef}
        className={`relative ${sizeClasses} w-full p-4 ${styles.modal} ${className}`}
        tabIndex={-1}
        id={id}
      >
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              {title && (
                <h3 
                  className="text-lg font-medium text-gray-900" 
                  id={`${id || 'modal'}-title`}
                >
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={onClose}
                  aria-label="Close"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}
          
          {/* Body */}
          <div className="px-6 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  // Use portal to render modal at the end of the document body
  return createPortal(modalContent, document.body);
};

export default Modal;
