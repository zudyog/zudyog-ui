
import React, { useMemo } from 'react';
import styles from './Pagination.module.css';

/**
 * Props for the Pagination component
 */
export interface PaginationProps {
  /** Current page number (1-based) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback function when page changes */
  onPageChange: (page: number) => void;
  /** Number of page buttons to show */
  siblingCount?: number;
  /** Size variant of the pagination component */
  size?: 'small' | 'medium' | 'large';
  /** Whether the pagination is disabled */
  disabled?: boolean;
  /** Whether to show the first/last page buttons */
  showBoundaryButtons?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * Pagination component for navigating between pages of content
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  size = 'medium',
  disabled = false,
  showBoundaryButtons = true,
  className = '',
}) => {
  /**
   * Generate the range of page numbers to display
   */
  const pageNumbers = useMemo(() => {
    const totalPageNumbers = siblingCount * 2 + 3; // siblings + current + first + last
    
    // If we have enough space to show all pages
    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
    
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;
    
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 1 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, -1, totalPages];
    }
    
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 1 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [1, -1, ...rightRange];
    }
    
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, -1, ...middleRange, -1, totalPages];
    }
    
    return [];
  }, [currentPage, totalPages, siblingCount]);

  /**
   * Handle page change
   */
  const handlePageChange = (page: number) => {
    if (disabled || page === currentPage) return;
    onPageChange(page);
  };

  /**
   * Get size-specific classes
   */
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return styles.small;
      case 'large':
        return styles.large;
      default:
        return styles.medium;
    }
  };

  return (
    <nav className={`${styles.pagination} ${getSizeClasses()} ${className} ${disabled ? styles.disabled : ''}`}>
      <ul className={styles.paginationList}>
        {/* Previous button */}
        <li className={styles.paginationItem}>
          <button
            className={`${styles.paginationButton} ${currentPage === 1 ? styles.disabled : ''}`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={disabled || currentPage === 1}
            aria-label="Previous page"
          >
            <span aria-hidden="true">&laquo;</span>
          </button>
        </li>

        {/* First page button */}
        {showBoundaryButtons && currentPage > siblingCount + 2 && (
          <li className={styles.paginationItem}>
            <button
              className={styles.paginationButton}
              onClick={() => handlePageChange(1)}
              disabled={disabled}
              aria-label="First page"
            >
              1
            </button>
          </li>
        )}

        {/* Page numbers */}
        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber === -1) {
            return (
              <li key={`ellipsis-${index}`} className={styles.paginationItem}>
                <span className={styles.ellipsis}>...</span>
              </li>
            );
          }
          
          return (
            <li key={pageNumber} className={styles.paginationItem}>
              <button
                className={`${styles.paginationButton} ${pageNumber === currentPage ? styles.active : ''}`}
                onClick={() => handlePageChange(pageNumber)}
                disabled={disabled}
                aria-label={`Page ${pageNumber}`}
                aria-current={pageNumber === currentPage ? 'page' : undefined}
              >
                {pageNumber}
              </button>
            </li>
          );
        })}

        {/* Last page button */}
        {showBoundaryButtons && currentPage < totalPages - siblingCount - 1 && (
          <li className={styles.paginationItem}>
            <button
              className={styles.paginationButton}
              onClick={() => handlePageChange(totalPages)}
              disabled={disabled}
              aria-label="Last page"
            >
              {totalPages}
            </button>
          </li>
        )}

        {/* Next button */}
        <li className={styles.paginationItem}>
          <button
            className={`${styles.paginationButton} ${currentPage === totalPages ? styles.disabled : ''}`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={disabled || currentPage === totalPages}
            aria-label="Next page"
          >
            <span aria-hidden="true">&raquo;</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
