
import React, { useState, useEffect, useRef } from 'react';
import styles from './Transitions.module.css';

/**
 * Base transition props interface
 */
export interface BaseTransitionProps {
  /** Whether the component is shown */
  in: boolean;
  /** Duration of the transition in milliseconds */
  timeout?: number;
  /** Callback fired when the transition has entered */
  onEntered?: () => void;
  /** Callback fired when the transition has exited */
  onExited?: () => void;
  /** Children to render */
  children: React.ReactNode;
  /** Optional className to apply */
  className?: string;
}

/**
 * Props for the Fade component
 */
export interface FadeProps extends BaseTransitionProps {
  /** Initial opacity value when not visible */
  initialOpacity?: number;
}

/**
 * Props for the Collapse component
 */
export interface CollapseProps extends BaseTransitionProps {
  /** Direction of the collapse */
  direction?: 'horizontal' | 'vertical';
}

/**
 * Props for the Grow component
 */
export interface GrowProps extends BaseTransitionProps {
  /** Initial scale value when not visible */
  initialScale?: number;
}

/**
 * Props for the Slide component
 */
export interface SlideProps extends BaseTransitionProps {
  /** Direction of the slide */
  direction?: 'up' | 'down' | 'left' | 'right';
  /** Distance to slide in pixels */
  distance?: number;
}

/**
 * Props for the Zoom component
 */
export interface ZoomProps extends BaseTransitionProps {
  /** Initial scale value when not visible */
  initialScale?: number;
}

/**
 * Fade transition component
 */
export const Fade: React.FC<FadeProps> = ({
  in: inProp,
  timeout = 300,
  onEntered,
  onExited,
  children,
  className = '',
  initialOpacity = 0,
}) => {
  const [isVisible, setIsVisible] = useState(inProp);
  const [style, setStyle] = useState<React.CSSProperties>({
    opacity: inProp ? 1 : initialOpacity,
    transition: `opacity ${timeout}ms ease-in-out`,
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (inProp) {
      setIsVisible(true);
      // Allow DOM to update before changing opacity
      requestAnimationFrame(() => {
        setStyle({
          opacity: 1,
          transition: `opacity ${timeout}ms ease-in-out`,
        });
      });

      timeoutId = setTimeout(() => {
        onEntered?.();
      }, timeout);
    } else {
      setStyle({
        opacity: initialOpacity,
        transition: `opacity ${timeout}ms ease-in-out`,
      });

      timeoutId = setTimeout(() => {
        setIsVisible(false);
        onExited?.();
      }, timeout);
    }

    return () => clearTimeout(timeoutId);
  }, [inProp, timeout, onEntered, onExited, initialOpacity]);

  if (!isVisible && !inProp) return null;

  return (
    <div className={`${styles.transition} ${className}`} style={style}>
      {children}
    </div>
  );
};

/**
 * Collapse transition component
 */
export const Collapse: React.FC<CollapseProps> = ({
  in: inProp,
  timeout = 300,
  onEntered,
  onExited,
  children,
  className = '',
  direction = 'vertical',
}) => {
  const [isVisible, setIsVisible] = useState(inProp);
  const elementRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({
    overflow: 'hidden',
    transition: direction === 'vertical'
      ? `height ${timeout}ms ease-in-out`
      : `width ${timeout}ms ease-in-out`,
    height: direction === 'vertical' ? (inProp ? 'auto' : '0px') : 'auto',
    width: direction === 'horizontal' ? (inProp ? 'auto' : '0px') : 'auto',
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const element = elementRef.current;

    if (!element) return;

    if (inProp) {
      setIsVisible(true);

      // Get the natural dimensions
      const naturalHeight = element.scrollHeight;
      const naturalWidth = element.scrollWidth;

      // Set initial dimensions
      if (direction === 'vertical') {
        setStyle({
          overflow: 'hidden',
          height: '0px',
          transition: `height ${timeout}ms ease-in-out`,
        });
      } else {
        setStyle({
          overflow: 'hidden',
          width: '0px',
          transition: `width ${timeout}ms ease-in-out`,
        });
      }

      // Allow DOM to update before changing dimensions
      requestAnimationFrame(() => {
        if (direction === 'vertical') {
          setStyle({
            overflow: 'hidden',
            height: `${naturalHeight}px`,
            transition: `height ${timeout}ms ease-in-out`,
          });
        } else {
          setStyle({
            overflow: 'hidden',
            width: `${naturalWidth}px`,
            transition: `width ${timeout}ms ease-in-out`,
          });
        }
      });

      timeoutId = setTimeout(() => {
        setStyle(prev => ({
          ...prev,
          height: 'auto',
          width: 'auto',
        }));
        onEntered?.();
      }, timeout);
    } else {
      // Get current dimensions before collapsing
      const currentHeight = element.offsetHeight;
      const currentWidth = element.offsetWidth;

      // Set explicit dimensions
      if (direction === 'vertical') {
        setStyle({
          overflow: 'hidden',
          height: `${currentHeight}px`,
          transition: `height ${timeout}ms ease-in-out`,
        });
      } else {
        setStyle({
          overflow: 'hidden',
          width: `${currentWidth}px`,
          transition: `width ${timeout}ms ease-in-out`,
        });
      }

      // Allow DOM to update before changing dimensions
      requestAnimationFrame(() => {
        if (direction === 'vertical') {
          setStyle({
            overflow: 'hidden',
            height: '0px',
            transition: `height ${timeout}ms ease-in-out`,
          });
        } else {
          setStyle({
            overflow: 'hidden',
            width: '0px',
            transition: `width ${timeout}ms ease-in-out`,
          });
        }
      });

      timeoutId = setTimeout(() => {
        setIsVisible(false);
        onExited?.();
      }, timeout);
    }

    return () => clearTimeout(timeoutId);
  }, [inProp, timeout, onEntered, onExited, direction]);

  if (!isVisible && !inProp) return null;

  return (
    <div className={`${styles.transition} ${className}`} style={style} ref={elementRef}>
      <div className={direction === 'vertical' ? styles.collapseContent : styles.collapseContentHorizontal}>
        {children}
      </div>
    </div>
  );
};

/**
 * Grow transition component
 */
export const Grow: React.FC<GrowProps> = ({
  in: inProp,
  timeout = 300,
  onEntered,
  onExited,
  children,
  className = '',
  initialScale = 0.75,
}) => {
  const [isVisible, setIsVisible] = useState(inProp);
  const [style, setStyle] = useState<React.CSSProperties>({
    transform: inProp ? 'scale(1)' : `scale(${initialScale})`,
    opacity: inProp ? 1 : 0,
    transition: `transform ${timeout}ms ease-in-out, opacity ${timeout}ms ease-in-out`,
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (inProp) {
      setIsVisible(true);
      // Allow DOM to update before changing transform
      requestAnimationFrame(() => {
        setStyle({
          transform: 'scale(1)',
          opacity: 1,
          transition: `transform ${timeout}ms ease-in-out, opacity ${timeout}ms ease-in-out`,
        });
      });

      timeoutId = setTimeout(() => {
        onEntered?.();
      }, timeout);
    } else {
      setStyle({
        transform: `scale(${initialScale})`,
        opacity: 0,
        transition: `transform ${timeout}ms ease-in-out, opacity ${timeout}ms ease-in-out`,
      });

      timeoutId = setTimeout(() => {
        setIsVisible(false);
        onExited?.();
      }, timeout);
    }

    return () => clearTimeout(timeoutId);
  }, [inProp, timeout, onEntered, onExited, initialScale]);

  if (!isVisible && !inProp) return null;

  return (
    <div className={`${styles.transition} ${className}`} style={style}>
      {children}
    </div>
  );
};

/**
 * Slide transition component
 */
export const Slide: React.FC<SlideProps> = ({
  in: inProp,
  timeout = 300,
  onEntered,
  onExited,
  children,
  className = '',
  direction = 'down',
  distance = 20,
}) => {
  const [isVisible, setIsVisible] = useState(inProp);

  const getTransform = (isIn: boolean) => {
    if (!isIn) {
      switch (direction) {
        case 'up': return `translateY(${distance}px)`;
        case 'down': return `translateY(-${distance}px)`;
        case 'left': return `translateX(${distance}px)`;
        case 'right': return `translateX(-${distance}px)`;
        default: return 'translateY(0)';
      }
    }
    return 'translate(0, 0)';
  };

  const [style, setStyle] = useState<React.CSSProperties>({
    transform: getTransform(inProp),
    opacity: inProp ? 1 : 0,
    transition: `transform ${timeout}ms ease-in-out, opacity ${timeout}ms ease-in-out`,
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (inProp) {
      setIsVisible(true);
      // Allow DOM to update before changing transform
      requestAnimationFrame(() => {
        setStyle({
          transform: 'translate(0, 0)',
          opacity: 1,
          transition: `transform ${timeout}ms ease-in-out, opacity ${timeout}ms ease-in-out`,
        });
      });

      timeoutId = setTimeout(() => {
        onEntered?.();
      }, timeout);
    } else {
      setStyle({
        transform: getTransform(false),
        opacity: 0,
        transition: `transform ${timeout}ms ease-in-out, opacity ${timeout}ms ease-in-out`,
      });

      timeoutId = setTimeout(() => {
        setIsVisible(false);
        onExited?.();
      }, timeout);
    }

    return () => clearTimeout(timeoutId);
  }, [inProp, timeout, onEntered, onExited, direction, distance]);

  if (!isVisible && !inProp) return null;

  return (
    <div className={`${styles.transition} ${className}`} style={style}>
      {children}
    </div>
  );
};

/**
 * Zoom transition component
 */
export const Zoom: React.FC<ZoomProps> = ({
  in: inProp,
  timeout = 300,
  onEntered,
  onExited,
  children,
  className = '',
  initialScale = 0,
}) => {
  const [isVisible, setIsVisible] = useState(inProp);
  const [style, setStyle] = useState<React.CSSProperties>({
    transform: inProp ? 'scale(1)' : `scale(${initialScale})`,
    opacity: inProp ? 1 : 0,
    transition: `transform ${timeout}ms ease-in-out, opacity ${timeout}ms ease-in-out`,
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (inProp) {
      setIsVisible(true);
      // Allow DOM to update before changing transform
      requestAnimationFrame(() => {
        setStyle({
          transform: 'scale(1)',
          opacity: 1,
          transition: `transform ${timeout}ms ease-in-out, opacity ${timeout}ms ease-in-out`,
        });
      });

      timeoutId = setTimeout(() => {
        onEntered?.();
      }, timeout);
    } else {
      setStyle({
        transform: `scale(${initialScale})`,
        opacity: 0,
        transition: `transform ${timeout}ms ease-in-out, opacity ${timeout}ms ease-in-out`,
      });

      timeoutId = setTimeout(() => {
        setIsVisible(false);
        onExited?.();
      }, timeout);
    }

    return () => clearTimeout(timeoutId);
  }, [inProp, timeout, onEntered, onExited, initialScale]);

  if (!isVisible && !inProp) return null;

  return (
    <div className={`${styles.transition} ${className}`} style={style}>
      {children}
    </div>
  );
};
