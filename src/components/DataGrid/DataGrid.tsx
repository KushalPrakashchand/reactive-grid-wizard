
import React, { useState, useMemo } from 'react';
import { ColumnHeader } from './ColumnHeader';
import { DataRow } from './DataRow';
import { GroupingPanel } from './GroupingPanel';
import { DataGridProps, SortState, FilterState, GroupState } from './types';
import { sortData, filterData, groupData } from './utils';
import { cn } from '@/lib/utils';

export function DataGrid<T = any>({
  data,
  columns,
  defaultSort,
  enableGrouping = true,
  enableFiltering = true,
  enableSorting = true,
  rowHeight = 40,
  className,
  onRowClick
}: DataGridProps<T>) {
  const [sortState, setSortState] = useState<SortState>(
    defaultSort || { column: '', direction: null }
  );
  const [filterState, setFilterState] = useState<FilterState>({});
  const [groupState, setGroupState] = useState<GroupState>({
    groupBy: [],
    expandedGroups: new Set()
  });

  const processedData = useMemo(() => {
    let result = [...data];
    
    // Apply filters
    if (enableFiltering) {
      result = filterData(result, filterState, columns);
    }
    
    // Apply sorting
    if (enableSorting) {
      result = sortData(result, sortState, columns);
    }
    
    // Apply grouping
    if (enableGrouping) {
      return groupData(result, groupState.groupBy, columns, groupState.expandedGroups);
    }
    
    return result.map(item => ({ type: 'data' as const, data: item }));
  }, [data, columns, sortState, filterState, groupState, enableFiltering, enableSorting, enableGrouping]);

  const handleSort = (columnKey: string) => {
    if (!enableSorting) return;
    
    setSortState(prev => {
      if (prev.column === columnKey) {
        // Cycle through: asc -> desc -> none
        switch (prev.direction) {
          case 'asc':
            return { column: columnKey, direction: 'desc' };
          case 'desc':
            return { column: '', direction: null };
          default:
            return { column: columnKey, direction: 'asc' };
        }
      }
      return { column: columnKey, direction: 'asc' };
    });
  };

  const handleFilter = (columnKey: string, value: any) => {
    if (!enableFiltering) return;
    
    setFilterState(prev => ({
      ...prev,
      [columnKey]: value || undefined
    }));
  };

  const handleGroupByChange = (groupBy: string[]) => {
    setGroupState(prev => ({
      ...prev,
      groupBy,
      expandedGroups: new Set() // Reset expanded groups when grouping changes
    }));
  };

  const handleGroupToggle = (groupPath: string) => {
    setGroupState(prev => {
      const newExpandedGroups = new Set(prev.expandedGroups);
      if (newExpandedGroups.has(groupPath)) {
        newExpandedGroups.delete(groupPath);
      } else {
        newExpandedGroups.add(groupPath);
      }
      return {
        ...prev,
        expandedGroups: newExpandedGroups
      };
    });
  };

  // Calculate total width for proper alignment
  const totalWidth = columns.reduce((sum, col) => sum + (col.width || 150), 0);

  return (
    <div className={cn("border border-gray-200 rounded-lg overflow-hidden bg-white", className)}>
      {enableGrouping && (
        <GroupingPanel
          columns={columns}
          groupBy={groupState.groupBy}
          onGroupByChange={handleGroupByChange}
        />
      )}
      
      <div className="overflow-auto">
        {/* Header */}
        <div className="flex bg-gray-50 border-b border-gray-200" style={{ minWidth: totalWidth }}>
          {columns.map((column) => (
            <ColumnHeader
              key={column.key}
              column={column}
              sortState={sortState}
              filterState={filterState}
              onSort={handleSort}
              onFilter={handleFilter}
            />
          ))}
        </div>
        
        {/* Body */}
        <div className="max-h-96 overflow-y-auto">
          {processedData.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-gray-500">
              No data to display
            </div>
          ) : (
            <div style={{ minWidth: totalWidth }}>
              {processedData.map((row, index) => (
                <DataRow
                  key={row.type === 'group' ? `group-${row.groupKey}-${index}` : `data-${index}`}
                  row={row}
                  columns={columns}
                  rowHeight={rowHeight}
                  onClick={onRowClick}
                  onGroupToggle={handleGroupToggle}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
