
import React, { useState, useEffect } from 'react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/solid';
import styles from './Alert.module.css';

/**
 * Alert severity levels
 */
export type AlertSeverity = 'success' | 'error' | 'warning' | 'info';

/**
 * Alert component props
 */
export interface AlertProps {
  /** The main message to display */
  message: string;
  /** Optional description with more details */
  description?: string;
  /** Alert severity level */
  severity?: AlertSeverity;
  /** Whether the alert can be dismissed */
  dismissible?: boolean;
  /** Auto-hide duration in milliseconds (0 to disable) */
  autoHideDuration?: number;
  /** Optional action button text */
  actionText?: string;
  /** Optional action button callback */
  onAction?: () => void;
  /** Callback fired when alert is closed */
  onClose?: () => void;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Alert component that displays important messages with different severity levels
 */
export const Alert: React.FC<AlertProps> = ({
  message,
  description,
  severity = 'info',
  dismissible = true,
  autoHideDuration = 0,
  actionText,
  onAction,
  onClose,
  className = '',
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (autoHideDuration > 0) {
      timer = setTimeout(() => {
        handleClose();
      }, autoHideDuration);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autoHideDuration]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible) return null;

  const severityIcon = {
    success: <CheckCircleIcon className={styles.icon} />,
    error: <XCircleIcon className={styles.icon} />,
    warning: <ExclamationCircleIcon className={styles.icon} />,
    info: <InformationCircleIcon className={styles.icon} />,
  };

  return (
    <div
      className={`${styles.alert} ${styles[severity]} ${className}`}
      role="alert"
    >
      <div className={styles.iconContainer}>
        {severityIcon[severity]}
      </div>

      <div className={styles.content}>
        <div className={styles.message}>{message}</div>
        {description && <div className={styles.description}>{description}</div>}
      </div>

      <div className={styles.actions}>
        {actionText && onAction && (
          <button
            className={styles.actionButton}
            onClick={onAction}
          >
            {actionText}
          </button>
        )}

        {dismissible && (
          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close alert"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
