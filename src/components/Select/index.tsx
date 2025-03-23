
import React, { useState, useRef, useEffect } from 'react';
import styles from './Select.module.css';

/**
 * Option interface for Select component
 */
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

/**
 * Props for Select component
 */
export interface SelectProps {
  /**
   * Array of options to display in the select
   */
  options: SelectOption[];
  
  /**
   * Currently selected value(s)
   */
  value: SelectOption | SelectOption[] | null;
  
  /**
   * Callback when selection changes
   */
  onChange: (value: SelectOption | SelectOption[] | null) => void;
  
  /**
   * Whether multiple options can be selected
   */
  multiple?: boolean;
  
  /**
   * Whether to use native HTML select or custom implementation
   */
  native?: boolean;
  
  /**
   * Placeholder text when no option is selected
   */
  placeholder?: string;
  
  /**
   * Whether the select is disabled
   */
  disabled?: boolean;
  
  /**
   * Additional CSS class names
   */
  className?: string;
  
  /**
   * Label for the select
   */
  label?: string;
  
  /**
   * Error message to display
   */
  error?: string;
}

/**
 * Select component for choosing one or multiple options from a dropdown
 */
export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  multiple = false,
  native = false,
  placeholder = "Select an option",
  disabled = false,
  className = "",
  label,
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener("click", handler);
    
    return () => {
      window.removeEventListener("click", handler);
    };
  }, []);

  // Reset highlighted index when options change or dropdown opens
  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(0);
    }
  }, [isOpen, options]);

  // Native select implementation
  if (native) {
    return (
      <div className={`${styles.selectContainer} ${className}`}>
        {label && (
          <label className={styles.label}>
            {label}
          </label>
        )}
        <select
          className={`${styles.nativeSelect} ${error ? styles.error : ''} ${disabled ? styles.disabled : ''}`}
          value={multiple 
            ? (value as SelectOption[])?.map(v => v.value).join(',') 
            : (value as SelectOption)?.value?.toString() || ''}
          onChange={e => {
            const selectedValues = multiple 
              ? Array.from(e.target.selectedOptions).map(option => 
                  options.find(opt => opt.value.toString() === option.value) as SelectOption
                )
              : options.find(opt => opt.value.toString() === e.target.value) || null;
            
            onChange(selectedValues);
          }}
          multiple={multiple}
          disabled={disabled}
        >
          {!multiple && <option value="">{placeholder}</option>}
          {options.map(option => (
            <option 
              key={option.value} 
              value={option.value.toString()}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        {error && <div className={styles.errorMessage}>{error}</div>}
      </div>
    );
  }

  // Custom select implementation
  const clearOptions = () => {
    multiple ? onChange([]) : onChange(null);
  };

  const selectOption = (option: SelectOption) => {
    if (option.disabled) return;
    
    if (multiple) {
      if (value == null) {
        onChange([option]);
      } else {
        const valueArray = value as SelectOption[];
        if (valueArray.some(val => val.value === option.value)) {
          onChange(valueArray.filter(val => val.value !== option.value));
        } else {
          onChange([...valueArray, option]);
        }
      }
    } else {
      if (option !== value) onChange(option);
    }
  };

  const isOptionSelected = (option: SelectOption) => {
    if (multiple) {
      return (value as SelectOption[])?.some(val => val.value === option.value) || false;
    }
    return option.value === (value as SelectOption)?.value;
  };

  return (
    <div className={`${styles.selectContainer} ${className}`}>
      {label && (
        <label className={styles.label}>
          {label}
        </label>
      )}
      <div 
        ref={containerRef}
        onClick={() => !disabled && setIsOpen(prev => !prev)}
        tabIndex={disabled ? -1 : 0}
        className={`${styles.customSelect} ${isOpen ? styles.open : ''} ${error ? styles.error : ''} ${disabled ? styles.disabled : ''}`}
        onBlur={() => setIsOpen(false)}
        onKeyDown={e => {
          if (disabled) return;
          
          switch (e.code) {
            case "Enter":
            case "Space":
              setIsOpen(prev => !prev);
              if (isOpen && options[highlightedIndex]) {
                selectOption(options[highlightedIndex]);
              }
              break;
            case "ArrowUp":
            case "ArrowDown": {
              if (!isOpen) {
                setIsOpen(true);
                break;
              }
              
              const newIndex = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
              if (newIndex >= 0 && newIndex < options.length) {
                setHighlightedIndex(newIndex);
              }
              break;
            }
            case "Escape":
              setIsOpen(false);
              break;
          }
        }}
      >
        <div className={styles.value}>
          {multiple ? (
            <div className={styles.multipleValues}>
              {(value as SelectOption[])?.length > 0 ? (
                (value as SelectOption[]).map(v => (
                  <div 
                    key={v.value} 
                    className={styles.multipleValue}
                    onClick={e => {
                      e.stopPropagation();
                      selectOption(v);
                    }}
                  >
                    {v.label}
                    <span className={styles.removeBtn}>&times;</span>
                  </div>
                ))
              ) : (
                <span className={styles.placeholder}>{placeholder}</span>
              )}
            </div>
          ) : value ? (
            (value as SelectOption).label
          ) : (
            <span className={styles.placeholder}>{placeholder}</span>
          )}
        </div>
        
        <div className={styles.actions}>
          {(multiple && (value as SelectOption[])?.length > 0) || (!multiple && value) ? (
            <button 
              onClick={e => {
                e.stopPropagation();
                clearOptions();
              }}
              className={styles.clearBtn}
              aria-label="Clear selection"
            >
              &times;
            </button>
          ) : null}
          <div className={styles.divider}></div>
          <div className={styles.caret}></div>
        </div>
        
        <ul className={`${styles.options} ${isOpen ? styles.show : ''}`}>
          {options.map((option, index) => (
            <li 
              key={option.value}
              onClick={e => {
                e.stopPropagation();
                selectOption(option);
                if (!multiple) setIsOpen(false);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`
                ${styles.option}
                ${isOptionSelected(option) ? styles.selected : ''}
                ${index === highlightedIndex ? styles.highlighted : ''}
                ${option.disabled ? styles.disabled : ''}
              `}
            >
              {multiple && (
                <input 
                  type="checkbox" 
                  checked={isOptionSelected(option)}
                  onChange={() => {}}
                  className={styles.checkbox}
                />
              )}
              {option.label}
            </li>
          ))}
        </ul>
      </div>
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default Select;
