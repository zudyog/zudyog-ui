
import React, { useEffect, useState } from 'react';
import styles from './Progress.module.css';

/**
 * Progress variant types
 */
export type ProgressVariant = 'linear' | 'circular';

/**
 * Progress mode types
 */
export type ProgressMode = 'determinate' | 'indeterminate';

/**
 * Progress component props interface
 */
export interface ProgressProps {
  /** The value of the progress indicator (0-100) */
  value?: number;
  /** The maximum value of the progress indicator */
  max?: number;
  /** The minimum value of the progress indicator */
  min?: number;
  /** The variant of the progress indicator */
  variant?: ProgressVariant;
  /** The mode of the progress indicator */
  mode?: ProgressMode;
  /** The size of the progress indicator (in pixels) */
  size?: number;
  /** The thickness of the progress indicator (in pixels) */
  thickness?: number;
  /** The color of the progress indicator */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  /** The label to display with the progress indicator */
  label?: string;
  /** Whether to show the value as a percentage */
  showValue?: boolean;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Progress component for displaying completion status of an operation
 * 
 * @param props - Progress component props
 * @returns React component
 */
export const Progress: React.FC<ProgressProps> = ({
  value = 0,
  max = 100,
  min = 0,
  variant = 'linear',
  mode = 'determinate',
  size = 44,
  thickness = 4,
  color = 'primary',
  label,
  showValue = false,
  className = '',
}) => {
  const [normalizedValue, setNormalizedValue] = useState(0);

  useEffect(() => {
    // Normalize value between 0 and 100
    const normalized = ((value - min) / (max - min)) * 100;
    setNormalizedValue(Math.min(100, Math.max(0, normalized)));
  }, [value, min, max]);

  // Color classes mapping
  const colorClasses = {
    primary: 'bg-blue-600',
    secondary: 'bg-purple-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600',
  };

  const trackColorClasses = {
    primary: 'bg-blue-200',
    secondary: 'bg-purple-200',
    success: 'bg-green-200',
    warning: 'bg-yellow-200',
    error: 'bg-red-200',
  };

  // Render linear progress
  if (variant === 'linear') {
    return (
      <div className={`w-full ${className}`}>
        {label && (
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            {showValue && mode === 'determinate' && (
              <span className="text-sm font-medium text-gray-700">{Math.round(normalizedValue)}%</span>
            )}
          </div>
        )}
        <div className={`h-${thickness} w-full ${trackColorClasses[color]} rounded-full overflow-hidden`}>
          {mode === 'determinate' ? (
            <div 
              className={`h-full ${colorClasses[color]} rounded-full transition-all duration-300 ease-in-out`} 
              style={{ width: `${normalizedValue}%` }}
              role="progressbar"
              aria-valuenow={normalizedValue}
              aria-valuemin={min}
              aria-valuemax={max}
            />
          ) : (
            <div 
              className={`h-full ${styles.linearIndeterminate} ${colorClasses[color]}`}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
            />
          )}
        </div>
      </div>
    );
  }

  // Render circular progress
  const circleSize = size;
  const radius = (circleSize - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className={`${mode === 'indeterminate' ? styles.circularRotate : ''}`}
          width={circleSize}
          height={circleSize}
          viewBox={`0 0 ${circleSize} ${circleSize}`}
          fill="none"
          role="progressbar"
          aria-valuenow={mode === 'determinate' ? normalizedValue : undefined}
          aria-valuemin={min}
          aria-valuemax={max}
        >
          {/* Background circle */}
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            strokeWidth={thickness}
            className={`${trackColorClasses[color]}`}
            fill="transparent"
          />
          
          {/* Progress circle */}
          {mode === 'determinate' ? (
            <circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              strokeWidth={thickness}
              className={`${colorClasses[color]} transition-all duration-300 ease-in-out`}
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform={`rotate(-90 ${circleSize / 2} ${circleSize / 2})`}
            />
          ) : (
            <circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              strokeWidth={thickness}
              className={`${colorClasses[color]} ${styles.circularIndeterminate}`}
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * 0.75}
              transform={`rotate(-90 ${circleSize / 2} ${circleSize / 2})`}
            />
          )}
        </svg>
        
        {showValue && mode === 'determinate' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-medium">{Math.round(normalizedValue)}%</span>
          </div>
        )}
      </div>
      
      {label && (
        <span className="mt-2 text-sm font-medium text-gray-700">{label}</span>
      )}
    </div>
  );
};

export default Progress;
