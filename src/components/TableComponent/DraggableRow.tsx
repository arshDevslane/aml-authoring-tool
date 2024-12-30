/* eslint-disable react/function-component-definition */
import { flexRender, Row } from '@tanstack/react-table';
import React, { CSSProperties } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { TableCell, TableRow } from '../ui/table';

type DraggableRowProps<T> = { row: Row<T> };

function DraggableRow<T>({ row }: DraggableRowProps<T>) {
  const {
    transform,
    transition,
    setNodeRef,
    isDragging,
    attributes,
    listeners,
  } = useSortable({
    id: row.id,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
  };
  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      key={row.id}
      data-state={row.getIsSelected() ? 'selected' : ''}
      {...attributes}
      {...listeners}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export default DraggableRow;
