
import React from 'react';
import { X, GripVertical } from 'lucide-react';
import { Column } from './types';
import { cn } from '@/lib/utils';

interface GroupingPanelProps<T> {
  columns: Column<T>[];
  groupBy: string[];
  onGroupByChange: (groupBy: string[]) => void;
  className?: string;
}

export function GroupingPanel<T>({
  columns,
  groupBy,
  onGroupByChange,
  className
}: GroupingPanelProps<T>) {
  const availableColumns = columns.filter(col => 
    col.groupable !== false && !groupBy.includes(col.key)
  );

  const addGroup = (columnKey: string) => {
    onGroupByChange([...groupBy, columnKey]);
  };

  const removeGroup = (columnKey: string) => {
    onGroupByChange(groupBy.filter(key => key !== columnKey));
  };

  const moveGroup = (fromIndex: number, toIndex: number) => {
    const newGroupBy = [...groupBy];
    const [moved] = newGroupBy.splice(fromIndex, 1);
    newGroupBy.splice(toIndex, 0, moved);
    onGroupByChange(newGroupBy);
  };

  return (
    <div className={cn("bg-gray-50 border-b border-gray-200 p-3", className)}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium text-gray-700">Group by:</span>
        {groupBy.length === 0 && (
          <span className="text-sm text-gray-500">
            Drag columns here to group by them
          </span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {groupBy.map((columnKey, index) => {
          const column = columns.find(col => col.key === columnKey);
          if (!column) return null;

          return (
            <div
              key={columnKey}
              className="flex items-center gap-1 px-2 py-1 bg-blue-100 border border-blue-200 rounded text-sm"
            >
              <GripVertical size={12} className="text-gray-400 cursor-move" />
              <span className="text-blue-800">{column.header}</span>
              <button
                onClick={() => removeGroup(columnKey)}
                className="text-blue-600 hover:text-blue-800 p-0.5 rounded hover:bg-blue-200"
              >
                <X size={12} />
              </button>
            </div>
          );
        })}
      </div>

      {availableColumns.length > 0 && (
        <div>
          <span className="text-xs text-gray-600 mb-1 block">Available columns:</span>
          <div className="flex flex-wrap gap-1">
            {availableColumns.map((column) => (
              <button
                key={column.key}
                onClick={() => addGroup(column.key)}
                className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                {column.header}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
