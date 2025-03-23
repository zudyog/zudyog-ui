
import React, { useState, useCallback } from 'react';
import styles from './Accordion.module.css';
import './index.css'
/**
 * Props for the Accordion component
 */
export interface AccordionProps {
  /** Title of the accordion */
  title: React.ReactNode;
  /** Content to be displayed when the accordion is expanded */
  children: React.ReactNode;
  /** Whether the accordion is expanded (controlled mode) */
  isOpen?: boolean;
  /** Callback when the accordion is toggled */
  onToggle?: (isOpen: boolean) => void;
  /** Default open state (uncontrolled mode) */
  defaultOpen?: boolean;
  /** Custom icon for the collapsed state */
  collapsedIcon?: React.ReactNode;
  /** Custom icon for the expanded state */
  expandedIcon?: React.ReactNode;
  /** Additional CSS class for the accordion container */
  className?: string;
  /** Additional CSS class for the accordion header */
  headerClassName?: string;
  /** Additional CSS class for the accordion content */
  contentClassName?: string;
  /** Whether to disable the accordion */
  disabled?: boolean;
}

/**
 * Accordion component for showing/hiding content sections
 */
export const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  isOpen: controlledIsOpen,
  onToggle,
  defaultOpen = false,
  collapsedIcon,
  expandedIcon,
  className = '',
  headerClassName = '',
  contentClassName = '',
  disabled = false,
}) => {
  // State for uncontrolled mode
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(defaultOpen);

  // Determine if component is in controlled or uncontrolled mode
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;

  // Handle toggle
  const handleToggle = useCallback(() => {
    if (disabled) return;

    if (isControlled) {
      onToggle?.(!controlledIsOpen);
    } else {
      setUncontrolledIsOpen(!uncontrolledIsOpen);
      onToggle?.(!uncontrolledIsOpen);
    }
  }, [isControlled, controlledIsOpen, uncontrolledIsOpen, onToggle, disabled]);

  // Default icons
  const defaultCollapsedIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  const defaultExpandedIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  );

  return (
    <div className={`border border-gray-200 rounded-md overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={handleToggle}
        className={`flex justify-between items-center w-full px-4 py-3 text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
          } ${headerClassName}`}
        disabled={disabled}
        aria-expanded={isOpen}
      >
        <span className="font-medium text-gray-800">{title}</span>
        <span className="ml-2 flex-shrink-0">
          {isOpen
            ? expandedIcon || defaultExpandedIcon
            : collapsedIcon || defaultCollapsedIcon}
        </span>
      </button>

      <div
        className={`${styles.accordionContent} ${isOpen ? styles.expanded : ''} ${contentClassName}`}
        aria-hidden={!isOpen}
      >
        <div className="px-4 py-3 bg-white">{children}</div>
      </div>
    </div>
  );
};

export default Accordion;
