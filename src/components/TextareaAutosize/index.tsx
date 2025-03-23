
import React, { useEffect, useRef, useState, ChangeEvent, TextareaHTMLAttributes } from 'react';
import styles from './TextareaAutosize.module.css';

/**
 * Props for the TextareaAutosize component
 * @extends TextareaHTMLAttributes<HTMLTextAreaElement>
 */
export interface TextareaAutosizeProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Minimum number of rows to display */
  minRows?: number;
  /** Maximum number of rows before scrolling */
  maxRows?: number;
  /** Value of the textarea */
  value?: string;
  /** Default value of the textarea */
  defaultValue?: string;
  /** Additional class names */
  className?: string;
  /** Callback for value changes */
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

/**
 * A textarea component that automatically adjusts its height based on content
 */
const TextareaAutosize: React.FC<TextareaAutosizeProps> = ({
  minRows = 3,
  maxRows = 10,
  value,
  defaultValue,
  className = '',
  onChange,
  ...props
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [textareaLineHeight, setTextareaLineHeight] = useState<number>(20);
  const [textareaValue, setTextareaValue] = useState<string>(value || defaultValue || '');

  // Calculate line height on mount
  useEffect(() => {
    if (textareaRef.current) {
      const lineHeight = parseInt(
        window.getComputedStyle(textareaRef.current).lineHeight,
        10
      ) || 20;
      setTextareaLineHeight(lineHeight);
    }
  }, []);

  // Update internal value when prop value changes
  useEffect(() => {
    if (value !== undefined && value !== textareaValue) {
      setTextareaValue(value);
      adjustHeight();
    }
  }, [value]);

  // Adjust height when value changes
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';

    // Calculate new height
    const minHeight = minRows * textareaLineHeight;
    const maxHeight = maxRows * textareaLineHeight;
    const scrollHeight = textarea.scrollHeight;

    let newHeight = scrollHeight;
    if (maxHeight && scrollHeight > maxHeight) {
      newHeight = maxHeight;
    } else if (minHeight && scrollHeight < minHeight) {
      newHeight = minHeight;
    }

    textarea.style.height = `${newHeight}px`;
  };

  // Handle textarea value change
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setTextareaValue(newValue);
    
    if (onChange) {
      onChange(e);
    }
    
    // Use setTimeout to ensure the DOM has updated
    setTimeout(adjustHeight, 0);
  };

  // Adjust height after initial render
  useEffect(() => {
    adjustHeight();
  }, [textareaLineHeight, minRows, maxRows]);

  return (
    <textarea
      ref={textareaRef}
      value={textareaValue}
      onChange={handleChange}
      className={`${styles.textareaAutosize} ${className}`}
      rows={minRows}
      {...props}
    />
  );
};

export default TextareaAutosize;
