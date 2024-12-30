import { getSelectionColumn, useTable } from '@/hooks/useTable';
import { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';
import { Button } from '@/shared-resources/ui/button';
import { Input } from '@/shared-resources/ui/input';
import { tableStringFilter } from '@/shared-resources/TableComponent/Filters/StringFilter';
import TableComponent from '@/shared-resources/TableComponent/TableComponent';

type Fruit = {
  identifier: string;
  name: string;
  price: number;
  unit: string;
};

const DemoComps = () => {
  const [searchFilters, setSearchFilters] = useState({
    name: '',
    page_no: 1,
    orderBy: null,
    sortOrder: null,
  });
  const [selectedRows, setSelectedRows] = React.useState<RowSelectionState>({});
  const columns: ColumnDef<Fruit>[] = useMemo(
    () => [
      getSelectionColumn(),
      {
        accessorKey: 'name',
        header: 'Name',
        filter: tableStringFilter,
      },
      {
        accessorKey: 'price',
        header: 'Price',
        enableColumnFilter: false,
      },
      {
        accessorKey: 'unit',
        header: 'Unit',
        cell: (info) =>
          info.getValue() === 'PP' ? 'Per Piece' : 'Per Kilogram',
        enableColumnFilter: false,
      },
    ],
    []
  );

  const rows = useMemo(
    () => [
      {
        identifier: '1',
        name: 'Apple',
        price: 100,
        unit: 'PP',
      },
      {
        identifier: '2',
        name: 'Orange',
        price: 200,
        unit: 'PP',
      },
      {
        identifier: '3',
        name: 'Banana',
        price: 300,
        unit: 'KG',
      },
    ],
    []
  );

  const tableInstance = useTable({
    columns,
    rows,
    enableRowSelection: true,
    selectedRows,
    setSelectedRows,
  });

  return (
    <div className='flex flex-col w-full h-full'>
      <div className='flex gap-6 items-center p-3'>
        <span>Buttons</span>
        <Button>Submit</Button>
        <Button disabled size='sm'>
          Disabled
        </Button>
        <Button variant='destructive' size='lg'>
          Delete
        </Button>
        <Button variant='outline'>Button</Button>
      </div>
      <div className='flex gap-6 items-center p-3'>
        <span>Input</span>
        <Input placeholder='Input' />
        <Input placeholder='Input' disabled />
        <Input placeholder='Input' hasError />
      </div>
      <div className='flex flex-col flex-1 p-3'>
        <span>Table</span>
        <TableComponent
          noPagination
          tableInstance={tableInstance}
          searchFilters={searchFilters}
          setSearchFilters={setSearchFilters}
        />
      </div>
    </div>
  );
};

export default DemoComps;
