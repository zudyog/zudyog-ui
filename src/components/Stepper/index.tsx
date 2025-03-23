
import React, { useState, useEffect } from 'react';
import styles from './Stepper.module.css';

/**
 * Step interface representing a single step in the stepper
 */
export interface Step {
  /** Unique identifier for the step */
  id: string | number;
  /** Label text to display */
  label: string;
  /** Optional description for the step */
  description?: string;
  /** Whether the step has an error */
  hasError?: boolean;
  /** Optional icon component to display instead of step number */
  icon?: React.ReactNode;
}

/**
 * Props for the Stepper component
 */
export interface StepperProps {
  /** Array of steps to display */
  steps: Step[];
  /** Current active step index (0-based) */
  activeStep: number;
  /** Orientation of the stepper */
  orientation?: 'horizontal' | 'vertical';
  /** Label placement relative to the step indicator */
  labelPlacement?: 'top' | 'bottom' | 'right' | 'left';
  /** Whether to show a connector line between steps */
  showConnectors?: boolean;
  /** Whether steps are clickable */
  clickable?: boolean;
  /** Callback when a step is clicked */
  onStepClick?: (stepIndex: number) => void;
  /** Custom class name for the stepper container */
  className?: string;
}

/**
 * Stepper component for multi-step flows
 */
export const Stepper: React.FC<StepperProps> = ({
  steps,
  activeStep,
  orientation = 'horizontal',
  labelPlacement = 'bottom',
  showConnectors = true,
  clickable = false,
  onStepClick,
  className = '',
}) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    // Mark all previous steps as completed
    const completed = Array.from({ length: activeStep }, (_, i) => i);
    setCompletedSteps(completed);
  }, [activeStep]);

  // Determine if label placement needs to be adjusted based on orientation
  const effectiveLabelPlacement = (() => {
    if (orientation === 'vertical') {
      // In vertical mode, 'top'/'bottom' don't make sense, default to 'right'
      return labelPlacement === 'top' || labelPlacement === 'bottom' ? 'right' : labelPlacement;
    }
    // In horizontal mode, 'left'/'right' don't make sense, default to 'bottom'
    return labelPlacement === 'left' || labelPlacement === 'right' ? 'bottom' : labelPlacement;
  })();

  const getStepStateClass = (index: number) => {
    if (index === activeStep) return styles.active;
    if (completedSteps.includes(index)) return styles.completed;
    if (steps[index].hasError) return styles.error;
    return styles.pending;
  };

  const getConnectorStateClass = (index: number) => {
    if (completedSteps.includes(index)) return styles.connectorCompleted;
    return styles.connectorPending;
  };

  const handleStepClick = (index: number) => {
    if (clickable && onStepClick) {
      onStepClick(index);
    }
  };

  return (
    <div 
      className={`${styles.stepper} ${styles[orientation]} ${className}`}
      data-orientation={orientation}
      data-label-placement={effectiveLabelPlacement}
    >
      {steps.map((step, index) => (
        <div key={step.id} className={styles.stepContainer}>
          {/* Step with label */}
          <div 
            className={`${styles.step} ${clickable ? styles.clickable : ''}`}
            onClick={() => handleStepClick(index)}
          >
            {/* Step indicator */}
            <div className={`${styles.stepIndicator} ${getStepStateClass(index)}`}>
              {step.icon || (completedSteps.includes(index) ? (
                <svg className={styles.checkIcon} viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
              ) : (
                index + 1
              ))}
            </div>
            
            {/* Step label and description */}
            <div className={styles.stepContent}>
              <div className={styles.stepLabel}>{step.label}</div>
              {step.description && (
                <div className={styles.stepDescription}>{step.description}</div>
              )}
            </div>
          </div>
          
          {/* Connector between steps */}
          {showConnectors && index < steps.length - 1 && (
            <div className={`${styles.connector} ${getConnectorStateClass(index)}`} />
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
