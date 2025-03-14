import React from 'react';
import {
  ColumnDef,
  getCoreRowModel,
  OnChangeFn,
  Row,
  RowSelectionState,
  Table,
  TableOptions,
  useReactTable,
} from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';

export function getSelectionColumn<T>() {
  return {
    id: 'selection',
    header: ({ table }: { table: Table<T> }) => (
      <Checkbox
        checked={
          table.getIsAllRowsSelected() ||
          (table.getIsSomeRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(checked) =>
          table.getToggleAllRowsSelectedHandler()({
            target: { checked: Boolean(checked) },
          })
        }
      />
    ),
    cell: ({ row }: { row: Row<T> }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={row.getToggleSelectedHandler()}
      />
    ),
    enableColumnFilter: false,
  } as ColumnDef<T>;
}

export function useTable<T extends { identifier: string }>({
  columns,
  rows,
  enableSorting = true,
  enableRowSelection = false,
  selectedRows = {},
  setSelectedRows,
}: Pick<TableOptions<T>, 'columns' | 'enableSorting' | 'enableRowSelection'> & {
  rows: T[];
  selectedRows?: RowSelectionState;
  setSelectedRows?: OnChangeFn<RowSelectionState>;
}) {
  return useReactTable({
    data: rows,
    columns,

    getCoreRowModel: getCoreRowModel(),
    getRowId: (row: T) => row.identifier,

    ...(enableRowSelection && {
      state: {
        rowSelection: selectedRows,
      },
      onRowSelectionChange: setSelectedRows,
    }),

    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,

    enableSorting,
    enableRowSelection,
  });
}
