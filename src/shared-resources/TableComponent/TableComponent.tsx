/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/function-component-definition */
import React from 'react';
import {
  closestCenter,
  DndContext,
  useSensor,
  useSensors,
  MouseSensor,
  PointerSensor,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import TableSkeleton from './TableSkeleton';
import AmlPagination from '../AmlPagination/AmlPagination';
import { TableComponentProps } from './types/TableComponent.types';

export default function TableComponent<T, S extends Record<string, any>>(
  props: TableComponentProps<T, S>
) {
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );
  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={props.onDragEnd}
      sensors={sensors}
    >
      <div className='flex-1 flex flex-col [&_>_div]:flex-1'>
        <TableSkeleton {...props} />
        {!props.noPagination && (
          <AmlPagination
            currentPage={props.searchFilters.page_no}
            totalPages={props.totalPages}
            onPageChange={(pageNo: number) =>
              props.setSearchFilters((p) => ({ ...p, page_no: pageNo }))
            }
            totalCount={props.totalCount}
          />
        )}
      </div>
    </DndContext>
  );
}
