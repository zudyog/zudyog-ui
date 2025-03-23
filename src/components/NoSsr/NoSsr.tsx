
import React, { JSX, useEffect, useState } from 'react';
import styles from './NoSsr.module.css';

/**
 * Props for the NoSsr component
 * @typedef NoSsrProps
 */
export interface NoSsrProps {
  /**
   * Content to render on client-side only
   */
  children: React.ReactNode;

  /**
   * Content to show during server-side rendering
   */
  fallback?: React.ReactNode;

  /**
   * Defer the rendering even on client for specified milliseconds
   */
  defer?: number;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Skip the client-side rendering condition
   */
  skipClientRender?: boolean;
}

/**
 * NoSsr (No Server-Side Rendering) component
 * 
 * This utility component prevents content from rendering during server-side rendering
 * and only renders it on the client side. Useful for components that rely on browser APIs.
 * 
 * @param {NoSsrProps} props - The component props
 * @returns {JSX.Element} The rendered component
 */
const NoSsr: React.FC<NoSsrProps> = ({
  children,
  fallback = null,
  defer = 0,
  className = '',
  skipClientRender = false,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (defer) {
      const timer = setTimeout(() => {
        setIsMounted(true);
      }, defer);

      return () => clearTimeout(timer);
    } else {
      setIsMounted(true);
    }
  }, [defer]);

  if (skipClientRender) {
    return fallback as JSX.Element;
  }

  return (
    <div className={`${styles.noSsr} ${className}`.trim()}>
      {isMounted ? children : fallback}
    </div>
  );
};

export default NoSsr;
