
export interface Column<T = any> {
  key: string;
  header: string;
  accessor: keyof T | ((row: T) => any);
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: 'text' | 'number' | 'date' | 'select';
  selectOptions?: { label: string; value: any }[];
  groupable?: boolean;
  formatter?: (value: any) => string;
}

export interface SortState {
  column: string;
  direction: 'asc' | 'desc' | null;
}

export interface FilterState {
  [key: string]: any;
}

export interface GroupState {
  groupBy: string[];
  expandedGroups: Set<string>;
}

export interface DataGridProps<T = any> {
  data: T[];
  columns: Column<T>[];
  defaultSort?: SortState;
  enableGrouping?: boolean;
  enableFiltering?: boolean;
  enableSorting?: boolean;
  rowHeight?: number;
  className?: string;
  onRowClick?: (row: T, index: number) => void;
}

export interface GroupedRow<T = any> {
  type: 'group' | 'data';
  data?: T;
  groupKey?: string;
  groupValue?: any;
  level?: number;
  childCount?: number;
  isExpanded?: boolean;
}
