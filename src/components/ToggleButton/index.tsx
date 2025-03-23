
import React, { useState, useEffect } from 'react';
import styles from './ToggleButton.module.css';

/**
 * Props for the ToggleButton component
 */
export interface ToggleButtonProps {
  /** The label text for the button */
  label: string;
  /** Whether the button is initially selected */
  initialSelected?: boolean;
  /** Callback function when the toggle state changes */
  onChange?: (selected: boolean) => void;
  /** Size of the toggle button */
  size?: 'sm' | 'md' | 'lg';
  /** Orientation of the toggle button */
  orientation?: 'horizontal' | 'vertical';
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Group name for exclusive selection in a group */
  groupName?: string;
  /** Value for the button when used in a group */
  value?: string;
  /** Whether the button is selected (controlled mode) */
  selected?: boolean;
  /** Additional CSS class names */
  className?: string;
}

/**
 * A toggle button component that can be used standalone or in groups
 */
export const ToggleButton: React.FC<ToggleButtonProps> = ({
  label,
  initialSelected = false,
  onChange,
  size = 'md',
  orientation = 'horizontal',
  disabled = false,
  groupName,
  value,
  selected: controlledSelected,
  className = '',
}) => {
  // Use internal state for uncontrolled mode
  const [internalSelected, setInternalSelected] = useState<boolean>(initialSelected);

  // Determine if we're in controlled or uncontrolled mode
  const isControlled = controlledSelected !== undefined;
  const isSelected = isControlled ? controlledSelected : internalSelected;

  // Update internal state if controlled value changes
  useEffect(() => {
    if (isControlled) {
      setInternalSelected(controlledSelected);
    }
  }, [controlledSelected, isControlled]);

  const handleToggle = () => {
    if (disabled) return;

    const newSelectedState = !isSelected;

    if (!isControlled) {
      setInternalSelected(newSelectedState);
    }

    if (onChange) {
      onChange(newSelectedState);
    }
  };

  const sizeClasses = {
    sm: 'text-xs py-1 px-2',
    md: 'text-sm py-2 px-3',
    lg: 'text-base py-3 px-4',
  };

  const baseClasses = `
    ${styles.toggleButton}
    font-medium rounded-md transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    ${sizeClasses[size]}
    ${orientation === 'vertical' ? 'flex flex-col items-center' : 'inline-flex items-center'}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `;

  const selectedClasses = isSelected
    ? 'bg-blue-600 text-white hover:bg-blue-700'
    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300';

  return (
    <button
      type="button"
      className={`${baseClasses} ${selectedClasses}`}
      onClick={handleToggle}
      disabled={disabled}
      aria-pressed={isSelected}
      value={value}
      name={groupName}
      data-selected={isSelected}
    >
      {label}
    </button>
  );
};

export default ToggleButton;
