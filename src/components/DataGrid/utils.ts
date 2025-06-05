
import { Column, SortState, FilterState, GroupedRow } from './types';

export function getValue<T>(row: T, column: Column<T>): any {
  if (typeof column.accessor === 'function') {
    return column.accessor(row);
  }
  return (row as any)[column.accessor];
}

export function formatValue(value: any, formatter?: (value: any) => string): string {
  if (formatter) {
    return formatter(value);
  }
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
}

export function sortData<T>(data: T[], sortState: SortState, columns: Column<T>[]): T[] {
  if (!sortState.column || !sortState.direction) {
    return data;
  }

  const column = columns.find(col => col.key === sortState.column);
  if (!column) {
    return data;
  }

  return [...data].sort((a, b) => {
    const aValue = getValue(a, column);
    const bValue = getValue(b, column);
    
    if (aValue === bValue) return 0;
    
    let comparison = 0;
    if (aValue > bValue) comparison = 1;
    if (aValue < bValue) comparison = -1;
    
    return sortState.direction === 'asc' ? comparison : -comparison;
  });
}

export function filterData<T>(data: T[], filterState: FilterState, columns: Column<T>[]): T[] {
  return data.filter(row => {
    return Object.entries(filterState).every(([columnKey, filterValue]) => {
      if (!filterValue) return true;
      
      const column = columns.find(col => col.key === columnKey);
      if (!column) return true;
      
      const cellValue = getValue(row, column);
      
      if (column.filterType === 'number') {
        const numValue = Number(cellValue);
        const filterNum = Number(filterValue);
        return !isNaN(numValue) && !isNaN(filterNum) && numValue === filterNum;
      }
      
      return String(cellValue).toLowerCase().includes(String(filterValue).toLowerCase());
    });
  });
}

export function groupData<T>(
  data: T[], 
  groupBy: string[], 
  columns: Column<T>[], 
  expandedGroups: Set<string>
): GroupedRow<T>[] {
  if (groupBy.length === 0) {
    return data.map(item => ({ type: 'data' as const, data: item }));
  }

  const grouped = groupByColumns(data, groupBy, columns);
  return flattenGroups<T>(grouped, expandedGroups);
}

function groupByColumns<T>(data: T[], groupBy: string[], columns: Column<T>[], level = 0): any {
  if (level >= groupBy.length) {
    return data;
  }

  const columnKey = groupBy[level];
  const column = columns.find(col => col.key === columnKey);
  if (!column) {
    return data;
  }

  const groups: { [key: string]: T[] } = {};
  
  data.forEach(item => {
    const value = getValue(item, column);
    const key = String(value);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
  });

  const result: any = {};
  Object.entries(groups).forEach(([key, items]) => {
    result[key] = groupByColumns(items, groupBy, columns, level + 1);
  });

  return result;
}

function flattenGroups<T>(
  grouped: any, 
  expandedGroups: Set<string>, 
  level = 0, 
  parentPath = ''
): GroupedRow<T>[] {
  const result: GroupedRow<T>[] = [];

  if (Array.isArray(grouped)) {
    // Base case: we have actual data
    return grouped.map(item => ({ type: 'data' as const, data: item }));
  }

  Object.entries(grouped).forEach(([key, value]) => {
    const groupPath = parentPath ? `${parentPath}.${key}` : key;
    const isExpanded = expandedGroups.has(groupPath);
    
    let childCount = 0;
    if (Array.isArray(value)) {
      childCount = value.length;
    } else {
      childCount = countItems(value);
    }

    const groupRow: GroupedRow<T> = {
      type: 'group',
      groupKey: groupPath,
      groupValue: key,
      level,
      childCount,
      isExpanded
    };

    result.push(groupRow);

    if (isExpanded) {
      const children = flattenGroups<T>(value, expandedGroups, level + 1, groupPath);
      result.push(...children);
    }
  });

  return result;
}

function countItems(obj: any): number {
  if (Array.isArray(obj)) {
    return obj.length;
  }
  
  let count = 0;
  Object.values(obj).forEach(value => {
    count += countItems(value);
  });
  
  return count;
}
