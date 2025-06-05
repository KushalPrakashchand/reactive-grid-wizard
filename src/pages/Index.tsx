
import React from 'react';
import { DataGrid } from '@/components/DataGrid';
import { Column } from '@/components/DataGrid/types';

// Sample data for demonstration
const sampleData = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    department: 'Engineering',
    salary: 85000,
    experience: 5,
    status: 'Active',
    joinDate: '2020-03-15'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    department: 'Marketing',
    salary: 75000,
    experience: 3,
    status: 'Active',
    joinDate: '2021-07-10'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    department: 'Engineering',
    salary: 95000,
    experience: 8,
    status: 'Active',
    joinDate: '2019-01-20'
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice@example.com',
    department: 'Sales',
    salary: 70000,
    experience: 2,
    status: 'Inactive',
    joinDate: '2022-05-03'
  },
  {
    id: 5,
    name: 'Charlie Wilson',
    email: 'charlie@example.com',
    department: 'Engineering',
    salary: 92000,
    experience: 6,
    status: 'Active',
    joinDate: '2020-11-12'
  },
  {
    id: 6,
    name: 'Diana Davis',
    email: 'diana@example.com',
    department: 'Marketing',
    salary: 68000,
    experience: 4,
    status: 'Active',
    joinDate: '2021-02-28'
  }
];

const Index = () => {
  const columns: Column<typeof sampleData[0]>[] = [
    {
      key: 'name',
      header: 'Name',
      accessor: 'name',
      width: 150,
      sortable: true,
      filterable: true,
      filterType: 'text',
      groupable: true
    },
    {
      key: 'email',
      header: 'Email',
      accessor: 'email',
      width: 200,
      sortable: true,
      filterable: true,
      filterType: 'text'
    },
    {
      key: 'department',
      header: 'Department',
      accessor: 'department',
      width: 130,
      sortable: true,
      filterable: true,
      filterType: 'select',
      selectOptions: [
        { label: 'Engineering', value: 'Engineering' },
        { label: 'Marketing', value: 'Marketing' },
        { label: 'Sales', value: 'Sales' }
      ],
      groupable: true
    },
    {
      key: 'salary',
      header: 'Salary',
      accessor: 'salary',
      width: 120,
      sortable: true,
      filterable: true,
      filterType: 'number',
      formatter: (value) => `$${value.toLocaleString()}`
    },
    {
      key: 'experience',
      header: 'Experience',
      accessor: 'experience',
      width: 110,
      sortable: true,
      filterable: true,
      filterType: 'number',
      formatter: (value) => `${value} years`,
      groupable: true
    },
    {
      key: 'status',
      header: 'Status',
      accessor: 'status',
      width: 100,
      sortable: true,
      filterable: true,
      filterType: 'select',
      selectOptions: [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' }
      ],
      groupable: true
    },
    {
      key: 'joinDate',
      header: 'Join Date',
      accessor: 'joinDate',
      width: 120,
      sortable: true,
      filterable: true,
      filterType: 'text',
      formatter: (value) => new Date(value).toLocaleDateString()
    }
  ];

  const handleRowClick = (row: typeof sampleData[0], index: number) => {
    console.log('Row clicked:', row, 'at index:', index);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            React DataGrid Component Library
          </h1>
          <p className="text-gray-600 text-lg">
            A powerful data grid inspired by AG Grid with sorting, filtering, and grouping capabilities
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Features Demo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">🔄 Sorting</h3>
              <p className="text-blue-700 text-sm">Click column headers to sort data ascending, descending, or clear sorting</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-900 mb-2">🔍 Filtering</h3>
              <p className="text-green-700 text-sm">Use filter icons to filter by text, numbers, or select from dropdown options</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-900 mb-2">📊 Grouping</h3>
              <p className="text-purple-700 text-sm">Drag columns to the grouping panel to organize data hierarchically</p>
            </div>
          </div>
        </div>

        <DataGrid
          data={sampleData}
          columns={columns}
          defaultSort={{ column: 'name', direction: 'asc' }}
          enableGrouping={true}
          enableFiltering={true}
          enableSorting={true}
          onRowClick={handleRowClick}
          className="shadow-lg"
        />

        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Usage Example</h2>
          <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`import { DataGrid, Column } from '@/components/DataGrid';

const columns: Column<DataType>[] = [
  {
    key: 'name',
    header: 'Name',
    accessor: 'name',
    sortable: true,
    filterable: true,
    groupable: true
  },
  // ... more columns
];

<DataGrid
  data={data}
  columns={columns}
  enableGrouping={true}
  enableFiltering={true}
  enableSorting={true}
  onRowClick={(row, index) => console.log(row)}
/>`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Index;
