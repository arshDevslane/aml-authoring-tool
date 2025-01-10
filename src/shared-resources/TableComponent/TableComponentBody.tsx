import { TableCell, TableRow } from '@/components/ui/table';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import React from 'react';
import Loader from '@/components/Loader/Loader';
import DraggableRow from './DraggableRow';

type TableComponentBodyProps = {
  isLoading?: boolean;
  rows: any[];
  columnsLength: number;
  disableDrag?: boolean;
};

const TableComponentBody = ({
  isLoading,
  rows,
  disableDrag,
  columnsLength,
}: TableComponentBodyProps) => {
  if (isLoading) {
    return (
      <TableRow className='border-none'>
        <TableCell colSpan={columnsLength}>
          <div className='flex items-center justify-center h-full'>
            <Loader />
          </div>
        </TableCell>
      </TableRow>
    );
  }

  if (!rows.length) {
    return (
      <TableRow className='border-none'>
        <TableCell colSpan={columnsLength}>
          <div className='flex items-center justify-center h-full'>No Data</div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <SortableContext
      items={rows.map((row) => row.id)}
      strategy={verticalListSortingStrategy}
    >
      {rows.map((row) => (
        <DraggableRow key={row.id} row={row} disableDrag={disableDrag} />
      ))}
    </SortableContext>
  );
};

export default TableComponentBody;
