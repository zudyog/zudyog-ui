
import React, { useState, useRef, useEffect } from 'react';
import styles from './TextField.module.css';

/**
 * Input types supported by the TextField component
 */
export type TextFieldType = 
  | 'text'
  | 'password'
  | 'email'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'
  | 'time'
  | 'datetime-local';

/**
 * Position of adornments in the TextField
 */
export type AdornmentPosition = 'start' | 'end';

/**
 * Props for the TextField component
 */
export interface TextFieldProps {
  /** Unique identifier for the input */
  id?: string;
  /** Label text displayed above the input */
  label?: string;
  /** Input type */
  type?: TextFieldType;
  /** Placeholder text */
  placeholder?: string;
  /** Current value of the input */
  value?: string;
  /** Default value for uncontrolled component */
  defaultValue?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether the input is required */
  required?: boolean;
  /** Whether the input is read-only */
  readOnly?: boolean;
  /** Error message to display */
  error?: string;
  /** Helper text to display below the input */
  helperText?: string;
  /** Maximum number of characters allowed */
  maxLength?: number;
  /** Whether to show character count */
  showCharCount?: boolean;
  /** Whether the input should be multiline (textarea) */
  multiline?: boolean;
  /** Number of rows for multiline input */
  rows?: number;
  /** Maximum number of rows for multiline input */
  maxRows?: number;
  /** Element to display at the start of the input */
  startAdornment?: React.ReactNode;
  /** Element to display at the end of the input */
  endAdornment?: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Input width (full or auto) */
  width?: 'full' | 'auto';
  /** Callback fired when the value changes */
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  /** Callback fired when the input gains focus */
  onFocus?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  /** Callback fired when the input loses focus */
  onBlur?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  /** Callback fired when a key is pressed */
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  /** Callback fired when a key is released */
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

/**
 * TextField component for text input with various features
 */
export const TextField: React.FC<TextFieldProps> = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  defaultValue,
  disabled = false,
  required = false,
  readOnly = false,
  error,
  helperText,
  maxLength,
  showCharCount = false,
  multiline = false,
  rows = 3,
  maxRows,
  startAdornment,
  endAdornment,
  className = '',
  width = 'full',
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  onKeyUp,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value || defaultValue || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update internal state when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (multiline && textareaRef.current) {
      const textarea = textareaRef.current;
      
      // Reset height to calculate proper scrollHeight
      textarea.style.height = 'auto';
      
      // Calculate new height based on scrollHeight
      let newHeight = textarea.scrollHeight;
      
      // Apply max rows limit if specified
      if (maxRows) {
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
        const maxHeight = lineHeight * maxRows;
        newHeight = Math.min(newHeight, maxHeight);
      }
      
      textarea.style.height = `${newHeight}px`;
    }
  }, [inputValue, multiline, maxRows]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    
    // Apply maxLength constraint if specified
    if (maxLength !== undefined && newValue.length > maxLength) {
      return;
    }
    
    if (value === undefined) {
      setInputValue(newValue);
    }
    
    onChange?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  // Generate a unique ID if not provided
  const inputId = id || `textfield-${Math.random().toString(36).substring(2, 9)}`;
  
  // Determine container classes
  const containerClasses = `
    ${styles.container}
    ${width === 'full' ? 'w-full' : 'w-auto'}
    ${className}
  `;

  // Determine input wrapper classes
  const inputWrapperClasses = `
    ${styles.inputWrapper}
    ${isFocused ? styles.focused : ''}
    ${error ? styles.error : ''}
    ${disabled ? styles.disabled : ''}
    ${startAdornment ? styles.hasStartAdornment : ''}
    ${endAdornment ? styles.hasEndAdornment : ''}
  `;

  // Determine input classes
  const inputClasses = `
    ${styles.input}
    ${startAdornment ? 'pl-10' : ''}
    ${endAdornment ? 'pr-10' : ''}
  `;

  // Character count display
  const charCount = maxLength !== undefined && showCharCount ? (
    <div className={styles.charCount}>
      {inputValue.length}/{maxLength}
    </div>
  ) : null;

  // Render the appropriate input element
  const inputElement = multiline ? (
    <textarea
      id={inputId}
      ref={textareaRef}
      className={inputClasses}
      placeholder={placeholder}
      value={value !== undefined ? value : inputValue}
      defaultValue={defaultValue}
      disabled={disabled}
      required={required}
      readOnly={readOnly}
      rows={rows}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      aria-invalid={!!error}
      aria-describedby={helperText ? `${inputId}-helper-text` : undefined}
    />
  ) : (
    <input
      id={inputId}
      type={type}
      className={inputClasses}
      placeholder={placeholder}
      value={value !== undefined ? value : inputValue}
      defaultValue={defaultValue}
      disabled={disabled}
      required={required}
      readOnly={readOnly}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      aria-invalid={!!error}
      aria-describedby={helperText ? `${inputId}-helper-text` : undefined}
    />
  );

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <div className={inputWrapperClasses}>
        {startAdornment && (
          <div className={styles.startAdornment}>
            {startAdornment}
          </div>
        )}
        
        {inputElement}
        
        {endAdornment && (
          <div className={styles.endAdornment}>
            {endAdornment}
          </div>
        )}
      </div>
      
      <div className={styles.footer}>
        {(error || helperText) && (
          <div 
            id={`${inputId}-helper-text`}
            className={`${styles.helperText} ${error ? styles.errorText : ''}`}
          >
            {error || helperText}
          </div>
        )}
        
        {charCount}
      </div>
    </div>
  );
};

export default TextField;
