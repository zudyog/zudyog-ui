
import React, { useState, useEffect, useMemo } from 'react';
import styles from './Table.module.css';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/16/solid';


/**
 * Column configuration for the Table component
 */
export interface TableColumn<T> {
  /** Unique identifier for the column */
  id: string;
  /** Header text to display */
  header: string;
  /** Function to access the cell data from the row data */
  accessor: (row: T) => React.ReactNode;
  /** Whether the column is sortable */
  sortable?: boolean;
  /** Custom cell renderer */
  Cell?: (props: { value: any; row: T; index: number }) => React.ReactNode;
  /** Width of the column (e.g., '200px', '20%') */
  width?: string;
  /** Whether to hide this column on mobile screens */
  hideOnMobile?: boolean;
}

/**
 * Props for the Table component
 */
export interface TableProps<T> {
  /** Array of data to display in the table */
  data: T[];
  /** Array of column configurations */
  columns: TableColumn<T>[];
  /** Key in the data object that uniquely identifies each row */
  keyField: keyof T;
  /** Whether to enable row selection */
  selectable?: boolean;
  /** Function called when selected rows change */
  onSelectionChange?: (selectedRows: T[]) => void;
  /** Whether to enable pagination */
  pagination?: boolean;
  /** Number of rows per page when pagination is enabled */
  rowsPerPage?: number;
  /** Whether the header should stick to the top when scrolling */
  stickyHeader?: boolean;
  /** Whether the footer should stick to the bottom when scrolling */
  stickyFooter?: boolean;
  /** Custom empty state component when there's no data */
  emptyState?: React.ReactNode;
  /** Additional CSS class for the table */
  className?: string;
  /** Whether to enable zebra striping */
  striped?: boolean;
  /** Whether to enable hover effect on rows */
  hoverable?: boolean;
  /** Whether to make the table compact */
  compact?: boolean;
}

/**
 * Sort direction type
 */
type SortDirection = 'asc' | 'desc' | null;

/**
 * Sort state interface
 */
interface SortState {
  column: string | null;
  direction: SortDirection;
}

/**
 * A flexible data table component with sorting, selection, pagination, and customizable cells
 */
export function Table<T>({
  data,
  columns,
  keyField,
  selectable = false,
  onSelectionChange,
  pagination = false,
  rowsPerPage = 10,
  stickyHeader = false,
  stickyFooter = false,
  emptyState = <div className="p-4 text-center text-gray-500">No data available</div>,
  className = '',
  striped = true,
  hoverable = true,
  compact = false,
}: TableProps<T>) {
  const [sortState, setSortState] = useState<SortState>({ column: null, direction: null });
  const [selectedRows, setSelectedRows] = useState<Set<any>>(new Set());
  const [currentPage, setCurrentPage] = useState(0);

  // Reset pagination when data changes
  useEffect(() => {
    setCurrentPage(0);
  }, [data]);

  // Handle row selection
  const handleRowSelect = (row: T) => {
    const key = row[keyField] as any;
    const newSelectedRows = new Set(selectedRows);

    if (newSelectedRows.has(key)) {
      newSelectedRows.delete(key);
    } else {
      newSelectedRows.add(key);
    }

    setSelectedRows(newSelectedRows);

    if (onSelectionChange) {
      const selectedItems = data.filter(item => newSelectedRows.has(item[keyField] as any));
      onSelectionChange(selectedItems);
    }
  };

  // Handle select all rows
  const handleSelectAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
      if (onSelectionChange) onSelectionChange([]);
    } else {
      const newSelectedRows = new Set(data.map(row => row[keyField] as any));
      setSelectedRows(newSelectedRows);
      if (onSelectionChange) onSelectionChange([...data]);
    }
  };

  // Handle column sort
  const handleSort = (columnId: string) => {
    setSortState(prevState => {
      if (prevState.column === columnId) {
        return {
          column: columnId,
          direction: prevState.direction === 'asc' ? 'desc' : prevState.direction === 'desc' ? null : 'asc'
        };
      }
      return { column: columnId, direction: 'asc' };
    });
  };

  // Sort and paginate data
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply sorting
    if (sortState.column && sortState.direction) {
      const column = columns.find(col => col.id === sortState.column);
      if (column) {
        result.sort((a, b) => {
          const aValue = column.accessor(a);
          const bValue = column.accessor(b);

          // Handle different value types
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortState.direction === 'asc'
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          }

          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortState.direction === 'asc'
              ? aValue - bValue
              : bValue - aValue;
          }

          // Default comparison for other types
          const valA = String(aValue);
          const valB = String(bValue);
          return sortState.direction === 'asc'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        });
      }
    }

    // Apply pagination
    if (pagination) {
      const start = currentPage * rowsPerPage;
      result = result.slice(start, start + rowsPerPage);
    }

    return result;
  }, [data, columns, sortState, pagination, currentPage, rowsPerPage]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return pagination ? Math.ceil(data.length / rowsPerPage) : 1;
  }, [data.length, pagination, rowsPerPage]);

  // Generate page numbers for pagination
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(0);

      // Calculate middle pages
      const startPage = Math.max(1, currentPage - 1);
      const endPage = Math.min(totalPages - 2, currentPage + 1);

      // Add ellipsis after first page if needed
      if (startPage > 1) {
        pages.push(-1); // -1 represents ellipsis
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 2) {
        pages.push(-2); // -2 represents ellipsis
      }

      // Always show last page
      pages.push(totalPages - 1);
    }

    return pages;
  }, [currentPage, totalPages]);

  // Table class names
  const tableClasses = `
    ${styles.table}
    w-full
    border-collapse
    ${stickyHeader ? styles.stickyHeader : ''}
    ${stickyFooter ? styles.stickyFooter : ''}
    ${compact ? 'text-sm' : 'text-base'}
    ${className}
  `;

  // Empty state
  if (data.length === 0) {
    return (
      <div className="border rounded-lg overflow-hidden">
        {emptyState}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className={tableClasses}>
        <thead className={`bg-gray-50 text-gray-700 ${stickyHeader ? 'sticky top-0 z-10' : ''}`}>
          <tr>
            {selectable && (
              <th className="p-3 border-b">
                <input
                  type="checkbox"
                  checked={selectedRows.size === data.length && data.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
            )}
            {columns.map(column => (
              <th
                key={column.id}
                className={`
                  p-3 
                  border-b 
                  font-semibold 
                  text-left 
                  ${column.sortable ? 'cursor-pointer select-none' : ''}
                  ${column.hideOnMobile ? 'hidden md:table-cell' : ''}
                `}
                style={{ width: column.width }}
                onClick={column.sortable ? () => handleSort(column.id) : undefined}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.header}</span>
                  {column.sortable && (
                    <span className="inline-flex flex-col h-4">
                      <ChevronUpIcon
                        className={`h-2 w-2 ${sortState.column === column.id && sortState.direction === 'asc'
                          ? 'text-blue-600'
                          : 'text-gray-400'
                          }`}
                      />
                      <ChevronDownIcon
                        className={`h-2 w-2 ${sortState.column === column.id && sortState.direction === 'desc'
                          ? 'text-blue-600'
                          : 'text-gray-400'
                          }`}
                      />
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {processedData.map((row, rowIndex) => {
            const key = row[keyField] as any;
            const isSelected = selectedRows.has(key);

            return (
              <tr
                key={key}
                className={`
                  ${isSelected ? 'bg-blue-50' : ''}
                  ${striped && rowIndex % 2 === 1 ? 'bg-gray-50' : 'bg-white'}
                  ${hoverable ? 'hover:bg-gray-100' : ''}
                  transition-colors
                `}
              >
                {selectable && (
                  <td className="p-3 border-b">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleRowSelect(row)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                )}
                {columns.map(column => (
                  <td
                    key={`${key}-${column.id}`}
                    className={`p-3 border-b ${column.hideOnMobile ? 'hidden md:table-cell' : ''}`}
                  >
                    {column.Cell
                      ? column.Cell({ value: column.accessor(row), row, index: rowIndex })
                      : column.accessor(row)
                    }
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
        {pagination && (
          <tfoot className={`bg-gray-50 ${stickyFooter ? 'sticky bottom-0 z-10' : ''}`}>
            <tr>
              <td colSpan={selectable ? columns.length + 1 : columns.length} className="px-3 py-2">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-sm text-gray-700">
                    Showing {currentPage * rowsPerPage + 1} to {Math.min((currentPage + 1) * rowsPerPage, data.length)} of {data.length} entries
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                      disabled={currentPage === 0}
                      className="px-3 py-1 rounded border bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {pageNumbers.map((pageNum, index) => (
                      pageNum < 0 ? (
                        <span key={`ellipsis-${index}`} className="px-3 py-1">...</span>
                      ) : (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`
                            px-3 py-1 rounded border
                            ${currentPage === pageNum
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700'}
                          `}
                        >
                          {pageNum + 1}
                        </button>
                      )
                    ))}

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                      disabled={currentPage >= totalPages - 1}
                      className="px-3 py-1 rounded border bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
