
import React, { MouseEvent } from 'react';
import styles from './Chip.module.css';

/**
 * Avatar props for the Chip component
 */
export interface ChipAvatarProps {
  /** Image source URL */
  src?: string;
  /** Alternative text for the avatar */
  alt?: string;
  /** Custom class name for the avatar */
  className?: string;
  /** Custom content to render instead of an image */
  children?: React.ReactNode;
}

/**
 * Chip component props
 */
export interface ChipProps {
  /** The content to display inside the chip */
  label: string;
  /** Optional avatar to display at the start of the chip */
  avatar?: React.ReactElement<ChipAvatarProps>;
  /** Whether the chip is disabled */
  disabled?: boolean;
  /** Whether the chip is clickable */
  clickable?: boolean;
  /** Whether the chip can be deleted */
  deletable?: boolean;
  /** Custom class name for the chip */
  className?: string;
  /** Custom class name for the label */
  labelClassName?: string;
  /** Custom class name for the delete button */
  deleteIconClassName?: string;
  /** Variant of the chip */
  variant?: 'filled' | 'outlined';
  /** Color scheme of the chip */
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  /** Size of the chip */
  size?: 'small' | 'medium' | 'large';
  /** Callback fired when the chip is clicked */
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  /** Callback fired when the delete icon is clicked */
  onDelete?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Custom delete icon */
  deleteIcon?: React.ReactNode;
}

/**
 * Avatar component for the Chip
 */
export const ChipAvatar: React.FC<ChipAvatarProps> = ({
  src,
  alt = '',
  className = '',
  children
}) => {
  const baseClasses = 'flex-shrink-0 h-6 w-6 rounded-full object-cover mr-1';
  
  return (
    <div className={`${baseClasses} ${className} ${styles.chipAvatar}`}>
      {src ? (
        <img src={src} alt={alt} className="h-full w-full rounded-full" />
      ) : (
        children
      )}
    </div>
  );
};

/**
 * Chip component - Compact element representing an input, attribute, or action
 */
export const Chip: React.FC<ChipProps> = ({
  label,
  avatar,
  disabled = false,
  clickable = false,
  deletable = false,
  className = '',
  labelClassName = '',
  deleteIconClassName = '',
  variant = 'filled',
  color = 'default',
  size = 'medium',
  onClick,
  onDelete,
  deleteIcon
}) => {
  // Handle click event
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (disabled || !clickable) return;
    onClick?.(event);
  };

  // Handle delete event
  const handleDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (disabled) return;
    onDelete?.(event);
  };

  // Base classes
  const baseClasses = 'inline-flex items-center rounded-full transition-colors';
  
  // Size classes
  const sizeClasses = {
    small: 'text-xs px-2 py-0.5 h-6',
    medium: 'text-sm px-2.5 py-1 h-8',
    large: 'text-base px-3 py-1.5 h-10'
  }[size];
  
  // Variant and color classes
  const variantColorClasses = (() => {
    if (variant === 'outlined') {
      return {
        default: 'border border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50',
        primary: 'border border-blue-500 text-blue-700 bg-transparent hover:bg-blue-50',
        secondary: 'border border-purple-500 text-purple-700 bg-transparent hover:bg-purple-50',
        success: 'border border-green-500 text-green-700 bg-transparent hover:bg-green-50',
        error: 'border border-red-500 text-red-700 bg-transparent hover:bg-red-50',
        warning: 'border border-yellow-500 text-yellow-700 bg-transparent hover:bg-yellow-50',
        info: 'border border-sky-500 text-sky-700 bg-transparent hover:bg-sky-50'
      }[color];
    } else {
      return {
        default: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
        primary: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
        secondary: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
        success: 'bg-green-100 text-green-800 hover:bg-green-200',
        error: 'bg-red-100 text-red-800 hover:bg-red-200',
        warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
        info: 'bg-sky-100 text-sky-800 hover:bg-sky-200'
      }[color];
    }
  })();

  // State classes
  const stateClasses = {
    disabled: disabled ? 'opacity-50 cursor-not-allowed' : '',
    clickable: clickable && !disabled ? 'cursor-pointer' : ''
  };

  return (
    <div
      className={`
        ${baseClasses}
        ${sizeClasses}
        ${variantColorClasses}
        ${stateClasses.disabled}
        ${stateClasses.clickable}
        ${className}
        ${styles.chip}
      `}
      onClick={handleClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable && !disabled ? 0 : undefined}
    >
      {avatar && React.cloneElement(avatar, {
        className: `${avatar.props.className || ''} ${styles.chipAvatar}`
      })}
      
      <span className={`${styles.chipLabel} ${labelClassName}`}>{label}</span>
      
      {deletable && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={disabled}
          className={`
            ml-1 p-0.5 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-1
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
            ${deleteIconClassName}
            ${styles.chipDelete}
          `}
          aria-label="Remove"
        >
          {deleteIcon || (
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      )}
    </div>
  );
};

export default Chip;
