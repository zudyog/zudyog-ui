
import React, { useState, useEffect, useRef, KeyboardEvent, ChangeEvent } from 'react';
import styles from './Autocomplete.module.css';

/**
 * Option type for the Autocomplete component
 */
export interface AutocompleteOption {
  /** Unique identifier for the option */
  id: string | number;
  /** Display text for the option */
  label: string;
  /** Optional additional data */
  data?: any;
}

/**
 * Props for the Autocomplete component
 */
export interface AutocompleteProps {
  /** Array of options to display in the dropdown */
  options: AutocompleteOption[];
  /** Callback when selected options change */
  onChange: (selectedOptions: AutocompleteOption[]) => void;
  /** Initial selected options */
  initialSelected?: AutocompleteOption[];
  /** Allow multiple selections */
  multiple?: boolean;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Custom render function for each option */
  renderOption?: (option: AutocompleteOption) => React.ReactNode;
  /** Custom render function for selected options (in multiple mode) */
  renderSelectedOption?: (option: AutocompleteOption, onRemove: () => void) => React.ReactNode;
  /** Disable the component */
  disabled?: boolean;
  /** Maximum height for the dropdown in pixels */
  maxHeight?: number;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** Additional CSS class for the component */
  className?: string;
  /** Minimum characters to start searching */
  minSearchLength?: number;
  /** Debounce time in milliseconds for search */
  debounceTime?: number;
  /** Custom filter function */
  filterFunction?: (options: AutocompleteOption[], inputValue: string) => AutocompleteOption[];
  /** Callback when input value changes */
  onInputChange?: (value: string) => void;
}

/**
 * Autocomplete component that provides suggestions as the user types
 */
export const Autocomplete: React.FC<AutocompleteProps> = ({
  options,
  onChange,
  initialSelected = [],
  multiple = false,
  placeholder = 'Search...',
  renderOption,
  renderSelectedOption,
  disabled = false,
  maxHeight = 300,
  loading = false,
  error,
  className = '',
  minSearchLength = 1,
  debounceTime = 300,
  filterFunction,
  onInputChange,
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [filteredOptions, setFilteredOptions] = useState<AutocompleteOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<AutocompleteOption[]>(initialSelected);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter options based on input value
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (inputValue.length >= minSearchLength) {
        if (filterFunction) {
          setFilteredOptions(filterFunction(options, inputValue));
        } else {
          const filtered = options.filter(option =>
            option.label.toLowerCase().includes(inputValue.toLowerCase()) &&
            !selectedOptions.some(selected => selected.id === option.id)
          );
          setFilteredOptions(filtered);
        }
        if (!isOpen && inputValue.length > 0) {
          setIsOpen(true);
        }
      } else {
        setFilteredOptions([]);
        if (isOpen && inputValue.length === 0) {
          setIsOpen(false);
        }
      }
      setHighlightedIndex(-1);
    }, debounceTime);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [inputValue, options, selectedOptions, minSearchLength, filterFunction, isOpen, debounceTime]);

  // Notify parent component when selected options change
  useEffect(() => {
    onChange(selectedOptions);
  }, [selectedOptions, onChange]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (onInputChange) {
      onInputChange(value);
    }
  };

  const handleOptionSelect = (option: AutocompleteOption) => {
    if (multiple) {
      setSelectedOptions(prev => [...prev, option]);
      setInputValue('');
    } else {
      setSelectedOptions([option]);
      setInputValue(option.label);
      setIsOpen(false);
    }
    inputRef.current?.focus();
  };

  const handleRemoveOption = (optionId: string | number) => {
    setSelectedOptions(prev => prev.filter(option => option.id !== optionId));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev =>
        prev < filteredOptions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      handleOptionSelect(filteredOptions[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Backspace' && inputValue === '' && multiple && selectedOptions.length > 0) {
      handleRemoveOption(selectedOptions[selectedOptions.length - 1].id);
    }
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    if (inputValue.length >= minSearchLength) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    // Don't close dropdown immediately to allow clicking on options
    setTimeout(() => {
      if (!multiple) {
        // If single select and no match, reset input
        const matchingOption = options.find(
          option => option.label.toLowerCase() === inputValue.toLowerCase()
        );
        if (!matchingOption && selectedOptions.length === 0) {
          setInputValue('');
        } else if (!matchingOption && selectedOptions.length > 0) {
          setInputValue(selectedOptions[0].label);
        }
      }
    }, 200);
  };

  const defaultRenderOption = (option: AutocompleteOption) => (
    <div className={styles.option}>{option.label}</div>
  );

  const defaultRenderSelectedOption = (option: AutocompleteOption, onRemove: () => void) => (
    <div className={styles.selectedOption}>
      <span>{option.label}</span>
      <button
        type="button"
        onClick={onRemove}
        className={styles.removeButton}
        aria-label={`Remove ${option.label}`}
      >
        ×
      </button>
    </div>
  );

  return (
    <div
      className={`${styles.container} ${className} ${error ? styles.error : ''} ${disabled ? styles.disabled : ''}`}
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-owns="autocomplete-listbox"
    >
      <div
        className={`${styles.inputWrapper} ${isFocused ? styles.focused : ''}`}
        onClick={() => inputRef.current?.focus()}
      >
        {multiple && (
          <div className={styles.selectedOptionsContainer}>
            {selectedOptions.map(option => (
              <React.Fragment key={option.id}>
                {renderSelectedOption
                  ? renderSelectedOption(option, () => handleRemoveOption(option.id))
                  : defaultRenderSelectedOption(option, () => handleRemoveOption(option.id))
                }
              </React.Fragment>
            ))}
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={selectedOptions.length === 0 ? placeholder : multiple ? '' : placeholder}
          disabled={disabled}
          aria-autocomplete="list"
          aria-controls="autocomplete-listbox"
          aria-activedescendant={highlightedIndex >= 0 ? `option-${filteredOptions[highlightedIndex].id}` : undefined}
        />
        {loading && (
          <div className={styles.loadingIndicator}>
            <div className={styles.spinner}></div>
          </div>
        )}
        <button
          type="button"
          className={styles.clearButton}
          onClick={() => {
            setInputValue('');
            setSelectedOptions([]);
            inputRef.current?.focus();
          }}
          aria-label="Clear selection"
          tabIndex={-1}
          style={{ visibility: (inputValue || selectedOptions.length > 0) ? 'visible' : 'hidden' }}
        >
          ×
        </button>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {isOpen && filteredOptions.length > 0 && (
        <div
          ref={dropdownRef}
          className={styles.dropdown}
          style={{ maxHeight: `${maxHeight}px` }}
          id="autocomplete-listbox"
          role="listbox"
        >
          {filteredOptions.map((option, index) => (
            <div
              key={option.id}
              className={`${styles.optionContainer} ${index === highlightedIndex ? styles.highlighted : ''}`}
              onClick={() => handleOptionSelect(option)}
              onMouseEnter={() => setHighlightedIndex(index)}
              role="option"
              id={`option-${option.id}`}
              aria-selected={index === highlightedIndex}
            >
              {renderOption ? renderOption(option) : defaultRenderOption(option)}
            </div>
          ))}
        </div>
      )}

      {isOpen && inputValue.length >= minSearchLength && filteredOptions.length === 0 && !loading && (
        <div className={styles.noResults}>No results found</div>
      )}
    </div>
  );
};

export default Autocomplete;
