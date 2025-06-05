
import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Filter } from 'lucide-react';
import { Column, SortState, FilterState } from './types';
import { cn } from '@/lib/utils';

interface ColumnHeaderProps<T> {
  column: Column<T>;
  sortState: SortState;
  filterState: FilterState;
  onSort: (column: string) => void;
  onFilter: (column: string, value: any) => void;
}

export function ColumnHeader<T>({
  column,
  sortState,
  filterState,
  onSort,
  onFilter
}: ColumnHeaderProps<T>) {
  const [showFilter, setShowFilter] = useState(false);
  const isSorted = sortState.column === column.key;
  const isFiltered = !!filterState[column.key];

  const handleSort = () => {
    if (column.sortable !== false) {
      onSort(column.key);
    }
  };

  const renderFilter = () => {
    if (!column.filterable) return null;

    switch (column.filterType) {
      case 'select':
        return (
          <select
            value={filterState[column.key] || ''}
            onChange={(e) => onFilter(column.key, e.target.value)}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          >
            <option value="">All</option>
            {column.selectOptions?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'number':
        return (
          <input
            type="number"
            value={filterState[column.key] || ''}
            onChange={(e) => onFilter(column.key, e.target.value)}
            placeholder="Filter..."
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          />
        );
      default:
        return (
          <input
            type="text"
            value={filterState[column.key] || ''}
            onChange={(e) => onFilter(column.key, e.target.value)}
            placeholder="Filter..."
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          />
        );
    }
  };

  return (
    <div 
      className="border-r border-gray-200 last:border-r-0 flex-shrink-0"
      style={{ width: column.width || 150 }}
    >
      <div
        className={cn(
          "flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200",
          "hover:bg-gray-100 transition-colors",
          column.sortable !== false && "cursor-pointer"
        )}
        onClick={handleSort}
      >
        <span className="font-medium text-gray-900 text-sm truncate">{column.header}</span>
        <div className="flex items-center gap-1 flex-shrink-0">
          {column.filterable && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowFilter(!showFilter);
              }}
              className={cn(
                "p-1 rounded hover:bg-gray-200 transition-colors",
                isFiltered && "text-blue-600 bg-blue-100"
              )}
            >
              <Filter size={12} />
            </button>
          )}
          {column.sortable !== false && (
            <div className="flex flex-col">
              <ChevronUp
                size={12}
                className={cn(
                  "text-gray-400",
                  isSorted && sortState.direction === 'asc' && "text-blue-600"
                )}
              />
              <ChevronDown
                size={12}
                className={cn(
                  "text-gray-400 -mt-1",
                  isSorted && sortState.direction === 'desc' && "text-blue-600"
                )}
              />
            </div>
          )}
        </div>
      </div>
      {showFilter && column.filterable && (
        <div className="px-3 py-2 border-b border-gray-200 bg-white">
          {renderFilter()}
        </div>
      )}
    </div>
  );
}
