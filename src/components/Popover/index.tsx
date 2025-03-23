
import React, { useState, useRef, useEffect, ReactNode } from 'react';
import styles from './Popover.module.css';

/**
 * Position options for the popover
 */
export type PopoverPosition = 'top' | 'right' | 'bottom' | 'left' | 'top-start' | 'top-end' | 'right-start' | 'right-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end';

/**
 * Props for the Popover component
 */
export interface PopoverProps {
  /** The element that triggers the popover */
  trigger: ReactNode;
  /** The content to display inside the popover */
  content: ReactNode;
  /** Whether the popover is open or not */
  isOpen?: boolean;
  /** Callback when the popover opens */
  onOpen?: () => void;
  /** Callback when the popover closes */
  onClose?: () => void;
  /** Position of the popover relative to the trigger */
  position?: PopoverPosition;
  /** Whether to close the popover when clicking outside */
  closeOnClickOutside?: boolean;
  /** Whether to close the popover when pressing escape key */
  closeOnEsc?: boolean;
  /** Whether to close the popover when scrolling */
  closeOnScroll?: boolean;
  /** Additional class name for the popover container */
  className?: string;
  /** Additional class name for the popover content */
  contentClassName?: string;
  /** Whether the popover should have an arrow */
  hasArrow?: boolean;
  /** Offset distance from the trigger in pixels */
  offset?: number;
  /** Z-index for the popover */
  zIndex?: number;
  /** Whether the popover should be controlled externally or internally */
  controlled?: boolean;
}

/**
 * Popover component that displays floating content relative to a trigger element
 */
export const Popover: React.FC<PopoverProps> = ({
  trigger,
  content,
  isOpen: externalIsOpen,
  onOpen,
  onClose,
  position = 'bottom',
  closeOnClickOutside = true,
  closeOnEsc = true,
  closeOnScroll = false,
  className = '',
  contentClassName = '',
  hasArrow = true,
  offset = 8,
  zIndex = 10,
  controlled = false,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlled ? externalIsOpen : internalIsOpen;
  
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const handleToggle = () => {
    if (controlled) {
      if (isOpen) {
        onClose?.();
      } else {
        onOpen?.();
      }
    } else {
      setInternalIsOpen(!internalIsOpen);
      if (!internalIsOpen) {
        onOpen?.();
      } else {
        onClose?.();
      }
    }
  };

  const handleClose = () => {
    if (controlled) {
      onClose?.();
    } else {
      setInternalIsOpen(false);
      onClose?.();
    }
  };

  const updatePosition = () => {
    const triggerElement = triggerRef.current;
    const contentElement = contentRef.current;
    
    if (!triggerElement || !contentElement || !isOpen) return;
    
    const triggerRect = triggerElement.getBoundingClientRect();
    const contentRect = contentElement.getBoundingClientRect();
    
    let top = 0;
    let left = 0;
    
    // Calculate position based on the selected position prop
    switch (position) {
      case 'top':
        top = triggerRect.top - contentRect.height - offset;
        left = triggerRect.left + (triggerRect.width / 2) - (contentRect.width / 2);
        break;
      case 'top-start':
        top = triggerRect.top - contentRect.height - offset;
        left = triggerRect.left;
        break;
      case 'top-end':
        top = triggerRect.top - contentRect.height - offset;
        left = triggerRect.right - contentRect.width;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height / 2) - (contentRect.height / 2);
        left = triggerRect.right + offset;
        break;
      case 'right-start':
        top = triggerRect.top;
        left = triggerRect.right + offset;
        break;
      case 'right-end':
        top = triggerRect.bottom - contentRect.height;
        left = triggerRect.right + offset;
        break;
      case 'bottom':
        top = triggerRect.bottom + offset;
        left = triggerRect.left + (triggerRect.width / 2) - (contentRect.width / 2);
        break;
      case 'bottom-start':
        top = triggerRect.bottom + offset;
        left = triggerRect.left;
        break;
      case 'bottom-end':
        top = triggerRect.bottom + offset;
        left = triggerRect.right - contentRect.width;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height / 2) - (contentRect.height / 2);
        left = triggerRect.left - contentRect.width - offset;
        break;
      case 'left-start':
        top = triggerRect.top;
        left = triggerRect.left - contentRect.width - offset;
        break;
      case 'left-end':
        top = triggerRect.bottom - contentRect.height;
        left = triggerRect.left - contentRect.width - offset;
        break;
      default:
        top = triggerRect.bottom + offset;
        left = triggerRect.left + (triggerRect.width / 2) - (contentRect.width / 2);
    }
    
    // Ensure the popover stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Adjust horizontal position if needed
    if (left < 10) {
      left = 10;
    } else if (left + contentRect.width > viewportWidth - 10) {
      left = viewportWidth - contentRect.width - 10;
    }
    
    // Adjust vertical position if needed
    if (top < 10) {
      top = 10;
    } else if (top + contentRect.height > viewportHeight - 10) {
      top = viewportHeight - contentRect.height - 10;
    }
    
    contentElement.style.top = `${top}px`;
    contentElement.style.left = `${left}px`;
    
    // Set arrow position if enabled
    if (hasArrow) {
      const arrow = contentElement.querySelector(`.${styles.arrow}`) as HTMLElement;
      if (arrow) {
        // Position the arrow based on the popover position
        if (position.startsWith('top')) {
          arrow.style.bottom = '-6px';
          arrow.style.top = 'auto';
          arrow.style.left = '50%';
          arrow.style.transform = 'translateX(-50%) rotate(45deg)';
        } else if (position.startsWith('right')) {
          arrow.style.left = '-6px';
          arrow.style.right = 'auto';
          arrow.style.top = '50%';
          arrow.style.transform = 'translateY(-50%) rotate(45deg)';
        } else if (position.startsWith('bottom')) {
          arrow.style.top = '-6px';
          arrow.style.bottom = 'auto';
          arrow.style.left = '50%';
          arrow.style.transform = 'translateX(-50%) rotate(45deg)';
        } else if (position.startsWith('left')) {
          arrow.style.right = '-6px';
          arrow.style.left = 'auto';
          arrow.style.top = '50%';
          arrow.style.transform = 'translateY(-50%) rotate(45deg)';
        }
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      
      if (closeOnScroll) {
        window.addEventListener('scroll', handleClose);
      }
      
      if (closeOnClickOutside) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      
      if (closeOnEsc) {
        document.addEventListener('keydown', handleEscKey);
      }
    }
    
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', handleClose);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, position, closeOnClickOutside, closeOnEsc, closeOnScroll]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      contentRef.current && 
      !contentRef.current.contains(event.target as Node) &&
      triggerRef.current && 
      !triggerRef.current.contains(event.target as Node)
    ) {
      handleClose();
    }
  };

  const handleEscKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <div className={`${styles.popoverContainer} ${className}`}>
      <div 
        ref={triggerRef} 
        className={styles.trigger} 
        onClick={handleToggle}
      >
        {trigger}
      </div>
      
      {isOpen && (
        <div 
          ref={contentRef}
          className={`${styles.popoverContent} ${contentClassName}`}
          style={{ zIndex }}
        >
          {content}
          {hasArrow && <div className={styles.arrow} />}
        </div>
      )}
    </div>
  );
};

export default Popover;
