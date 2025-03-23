
import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './Slider.module.css';

/**
 * Props for the Slider component
 */
export interface SliderProps {
  /** Minimum value of the slider */
  min?: number;
  /** Maximum value of the slider */
  max?: number;
  /** Step size for discrete values */
  step?: number;
  /** Initial value or values for the slider */
  defaultValue?: number | [number, number];
  /** Controlled value or values for the slider */
  value?: number | [number, number];
  /** Whether the slider is disabled */
  disabled?: boolean;
  /** Whether to show marks on the track */
  showMarks?: boolean;
  /** Custom marks to display on the track */
  marks?: Record<number, React.ReactNode>;
  /** Whether to allow range selection */
  range?: boolean;
  /** Callback when value changes */
  onChange?: (value: number | [number, number]) => void;
  /** Callback when user starts dragging */
  onDragStart?: () => void;
  /** Callback when user stops dragging */
  onDragEnd?: () => void;
  /** Custom class name */
  className?: string;
  /** Custom track class name */
  trackClassName?: string;
  /** Custom thumb class name */
  thumbClassName?: string;
}

/**
 * Slider component for selecting values by dragging a thumb along a track
 */
export const Slider: React.FC<SliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  defaultValue = 0,
  value,
  disabled = false,
  showMarks = false,
  marks = {},
  range = false,
  onChange,
  onDragStart,
  onDragEnd,
  className = '',
  trackClassName = '',
  thumbClassName = '',
}) => {
  // Initialize state based on whether it's controlled or uncontrolled
  const [internalValue, setInternalValue] = useState<number | [number, number]>(
    value !== undefined ? value : defaultValue
  );

  // Track which thumb is being dragged (for range slider)
  const [activeDragThumb, setActiveDragThumb] = useState<'min' | 'max' | null>(null);

  // Refs for DOM elements
  const trackRef = useRef<HTMLDivElement>(null);
  const isControlled = value !== undefined;

  // Update internal value when controlled value changes
  useEffect(() => {
    if (isControlled) {
      setInternalValue(value);
    }
  }, [value, isControlled]);

  // Calculate percentage for positioning
  const getPercentage = useCallback((value: number): number => {
    return ((value - min) / (max - min)) * 100;
  }, [min, max]);

  // Calculate value from percentage
  const getValueFromPercentage = useCallback((percentage: number): number => {
    const rawValue = min + (percentage / 100) * (max - min);
    const steppedValue = Math.round(rawValue / step) * step;
    return Math.min(max, Math.max(min, steppedValue));
  }, [min, max, step]);

  // Handle track click
  const handleTrackClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const percentage = ((e.clientX - rect.left) / rect.width) * 100;
    const newValue = getValueFromPercentage(percentage);

    if (range && Array.isArray(internalValue)) {
      // For range slider, determine which thumb to move based on proximity
      const [minVal, maxVal] = internalValue;
      const minDistance = Math.abs(newValue - minVal);
      const maxDistance = Math.abs(newValue - maxVal);

      const updatedValue = minDistance <= maxDistance
        ? [newValue, maxVal]
        : [minVal, newValue];
      // TODO balaji Hambeere
      // if (!isControlled) {
      //   setInternalValue(updatedValue);
      // }
      // onChange?.(updatedValue);
    } else {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    }
  }, [disabled, getValueFromPercentage, internalValue, isControlled, onChange, range]);

  // Handle thumb drag start
  const handleThumbDragStart = useCallback((thumbType: 'min' | 'max') => (e: React.MouseEvent) => {
    if (disabled) return;
    e.stopPropagation();
    setActiveDragThumb(thumbType);
    onDragStart?.();

    const handleDrag = (moveEvent: MouseEvent) => {
      if (!trackRef.current) return;

      const rect = trackRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(100, ((moveEvent.clientX - rect.left) / rect.width) * 100));
      const newValue = getValueFromPercentage(percentage);

      if (range && Array.isArray(internalValue)) {
        const [minVal, maxVal] = internalValue;
        let updatedValue: [number, number];

        if (thumbType === 'min') {
          updatedValue = [Math.min(newValue, maxVal), maxVal];
        } else {
          updatedValue = [minVal, Math.max(newValue, minVal)];
        }

        if (!isControlled) {
          setInternalValue(updatedValue);
        }
        onChange?.(updatedValue);
      } else {
        if (!isControlled) {
          setInternalValue(newValue);
        }
        onChange?.(newValue);
      }
    };

    const handleDragEnd = () => {
      setActiveDragThumb(null);
      onDragEnd?.();
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleDragEnd);
    };

    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
  }, [disabled, getValueFromPercentage, internalValue, isControlled, onChange, onDragEnd, onDragStart, range]);

  // Render marks if enabled
  const renderMarks = () => {
    if (!showMarks) return null;

    const defaultMarks: Record<number, React.ReactNode> = {};
    if (Object.keys(marks).length === 0) {
      // Create default marks if none provided
      for (let i = min; i <= max; i += step) {
        defaultMarks[i] = null;
      }
    }

    const marksToRender = Object.keys(marks).length > 0 ? marks : defaultMarks;

    return Object.entries(marksToRender).map(([value, label]) => {
      const markValue = parseFloat(value);
      const percentage = getPercentage(markValue);

      return (
        <div
          key={value}
          className={styles.mark}
          style={{ left: `${percentage}%` }}
        >
          {label && <div className={styles.markLabel}>{label}</div>}
        </div>
      );
    });
  };

  // Calculate styles based on current value
  const getTrackStyles = () => {
    if (range && Array.isArray(internalValue)) {
      const [minVal, maxVal] = internalValue;
      const minPercentage = getPercentage(minVal);
      const maxPercentage = getPercentage(maxVal);

      return {
        left: `${minPercentage}%`,
        width: `${maxPercentage - minPercentage}%`,
      };
    } else {
      const percentage = getPercentage(internalValue as number);
      return {
        width: `${percentage}%`,
      };
    }
  };

  return (
    <div
      className={`${styles.sliderContainer} ${disabled ? styles.disabled : ''} ${className}`}
      data-testid="slider"
    >
      <div
        ref={trackRef}
        className={`${styles.track} ${trackClassName}`}
        onClick={handleTrackClick}
      >
        <div
          className={`${styles.filledTrack} ${trackClassName}`}
          style={getTrackStyles()}
        />

        {range && Array.isArray(internalValue) ? (
          <>
            <div
              className={`${styles.thumb} ${activeDragThumb === 'min' ? styles.active : ''} ${thumbClassName}`}
              style={{ left: `${getPercentage(internalValue[0])}%` }}
              onMouseDown={handleThumbDragStart('min')}
              tabIndex={disabled ? -1 : 0}
              role="slider"
              aria-valuemin={min}
              aria-valuemax={internalValue[1]}
              aria-valuenow={internalValue[0]}
              aria-disabled={disabled}
            />
            <div
              className={`${styles.thumb} ${activeDragThumb === 'max' ? styles.active : ''} ${thumbClassName}`}
              style={{ left: `${getPercentage(internalValue[1])}%` }}
              onMouseDown={handleThumbDragStart('max')}
              tabIndex={disabled ? -1 : 0}
              role="slider"
              aria-valuemin={internalValue[0]}
              aria-valuemax={max}
              aria-valuenow={internalValue[1]}
              aria-disabled={disabled}
            />
          </>
        ) : (
          <div
            className={`${styles.thumb} ${activeDragThumb === 'min' ? styles.active : ''} ${thumbClassName}`}
            style={{ left: `${getPercentage(internalValue as number)}%` }}
            onMouseDown={handleThumbDragStart('min')}
            tabIndex={disabled ? -1 : 0}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={internalValue as number}
            aria-disabled={disabled}
          />
        )}

        {renderMarks()}
      </div>
    </div>
  );
};

export default Slider;
