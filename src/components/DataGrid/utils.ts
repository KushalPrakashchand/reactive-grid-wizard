
import { Column, SortState, FilterState, GroupedRow } from './types';

export function sortData<T>(
  data: T[],
  sortState: SortState,
  columns: Column<T>[]
): T[] {
  if (!sortState.column || !sortState.direction) return data;

  const column = columns.find(col => col.key === sortState.column);
  if (!column) return data;

  return [...data].sort((a, b) => {
    const aValue = getValue(a, column);
    const bValue = getValue(b, column);

    let comparison = 0;
    if (aValue < bValue) comparison = -1;
    if (aValue > bValue) comparison = 1;

    return sortState.direction === 'asc' ? comparison : -comparison;
  });
}

export function filterData<T>(
  data: T[],
  filterState: FilterState,
  columns: Column<T>[]
): T[] {
  return data.filter(row => {
    return Object.entries(filterState).every(([columnKey, filterValue]) => {
      if (!filterValue) return true;

      const column = columns.find(col => col.key === columnKey);
      if (!column) return true;

      const cellValue = getValue(row, column);
      const stringValue = String(cellValue).toLowerCase();
      const filterString = String(filterValue).toLowerCase();

      switch (column.filterType) {
        case 'text':
          return stringValue.includes(filterString);
        case 'number':
          return Number(cellValue) === Number(filterValue);
        case 'select':
          return cellValue === filterValue;
        default:
          return stringValue.includes(filterString);
      }
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
  return flattenGroups(grouped, expandedGroups);
}

function groupByColumns<T>(
  data: T[],
  groupBy: string[],
  columns: Column<T>[],
  level = 0
): any {
  if (level >= groupBy.length) return data;

  const column = columns.find(col => col.key === groupBy[level]);
  if (!column) return data;

  const groups = data.reduce((acc, item) => {
    const value = getValue(item, column);
    const key = String(value);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);

  const result = {} as Record<string, any>;
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
    return grouped.map(item => ({ type: 'data' as const, data: item }));
  }

  Object.entries(grouped).forEach(([key, value]) => {
    const groupPath = parentPath ? `${parentPath}/${key}` : key;
    const isExpanded = expandedGroups.has(groupPath);
    
    result.push({
      type: 'group',
      groupKey: key,
      groupValue: key,
      level,
      childCount: Array.isArray(value) ? value.length : Object.keys(value).length,
      isExpanded
    });

    if (isExpanded) {
      result.push(...flattenGroups(value, expandedGroups, level + 1, groupPath));
    }
  });

  return result;
}

export function getValue<T>(row: T, column: Column<T>): any {
  if (typeof column.accessor === 'function') {
    return column.accessor(row);
  }
  return row[column.accessor];
}

export function formatValue(value: any, formatter?: (value: any) => string): string {
  if (formatter) return formatter(value);
  if (value === null || value === undefined) return '';
  return String(value);
}
