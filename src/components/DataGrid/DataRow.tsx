
import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Column, GroupedRow } from './types';
import { getValue, formatValue } from './utils';
import { cn } from '@/lib/utils';

interface DataRowProps<T> {
  row: GroupedRow<T>;
  columns: Column<T>[];
  rowHeight?: number;
  onClick?: (row: T, index: number) => void;
  onGroupToggle?: (groupPath: string) => void;
  index: number;
}

export function DataRow<T>({
  row,
  columns,
  rowHeight = 40,
  onClick,
  onGroupToggle,
  index
}: DataRowProps<T>) {
  if (row.type === 'group') {
    const groupPath = row.groupKey || '';
    
    return (
      <div
        className="flex items-center bg-gray-50 border-b border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors"
        style={{ height: rowHeight, paddingLeft: `${(row.level || 0) * 20 + 12}px` }}
        onClick={() => onGroupToggle?.(groupPath)}
      >
        <div className="flex items-center gap-2">
          {row.isExpanded ? (
            <ChevronDown size={16} className="text-gray-600" />
          ) : (
            <ChevronRight size={16} className="text-gray-600" />
          )}
          <span className="font-medium text-gray-900">
            {row.groupValue} ({row.childCount})
          </span>
        </div>
      </div>
    );
  }

  if (!row.data) return null;

  return (
    <div
      className={cn(
        "flex border-b border-gray-200 hover:bg-gray-50 transition-colors",
        onClick && "cursor-pointer"
      )}
      style={{ height: rowHeight }}
      onClick={() => onClick?.(row.data!, index)}
    >
      {columns.map((column) => {
        const value = getValue(row.data!, column);
        const formattedValue = formatValue(value, column.formatter);

        return (
          <div
            key={column.key}
            className="flex items-center px-3 py-2 border-r border-gray-200 last:border-r-0 text-sm text-gray-900"
            style={{ width: column.width }}
          >
            <span className="truncate">{formattedValue}</span>
          </div>
        );
      })}
    </div>
  );
}
