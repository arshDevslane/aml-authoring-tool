/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/function-component-definition */
import React, { useState } from 'react';
import { flexRender } from '@tanstack/react-table';
import { TableComponentProps } from '@/components/TableComponent/types/TableComponent.types';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
// import { PopoverArrow, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { cn, isValueEmpty } from '@/lib/utils';
import { SortOrder } from '@/enums/tableEnums';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import DraggableRow from './DraggableRow';

export default function TableSkeleton<T, S extends Record<string, any>>({
  tableInstance,
  searchFilters,
  setSearchFilters,
}: TableComponentProps<T, S>) {
  const [openedPopup, setOpenedPopup] = useState<string | null>(null);

  const handleSortState = (columnId: string) => {
    if (searchFilters.orderBy === columnId) {
      const orderBy =
        searchFilters.sortOrder === SortOrder.DESC ? null : columnId;

      if (orderBy) {
        setSearchFilters((p: any) => ({
          ...p,
          orderBy,
          sortOrder:
            p.sortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC,
        }));
      } else {
        setSearchFilters((p: any) => ({
          ...p,
          orderBy: null,
          sortOrder: null,
        }));
      }
    } else {
      setSearchFilters((p: any) => ({
        ...p,
        orderBy: columnId,
        sortOrder: SortOrder.ASC,
      }));
    }
  };

  return (
    <Table>
      <TableHeader>
        {tableInstance.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className='[&_button_svg[data-applied=false]]:hover:fill-primary/70 [&_button_svg[data-applied=true]]:hover:fill-primary [&_div[data-applied=false]_svg]:hover:text-primary/70 [&_div[data-applied=true]_svg]:hover:text-primary'
              >
                <div className='flex gap-3 items-center'>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  {header.column.getCanFilter() && (
                    <Popover
                      open={openedPopup === header.id}
                      onOpenChange={(open) =>
                        setOpenedPopup(open ? header.id : null)
                      }
                    >
                      <PopoverTrigger>
                        <Filter
                          data-applied={
                            !isValueEmpty(searchFilters?.[header.id])
                          }
                          className={cn(
                            'h-5 w-5',
                            openedPopup === header.id ||
                              !isValueEmpty(searchFilters?.[header.id])
                              ? 'fill-primary'
                              : 'fill-slate-400/50'
                          )}
                          strokeWidth={0}
                        />
                      </PopoverTrigger>
                      <PopoverContent>
                        {header.column.columnDef.filter?.({
                          filterValue: searchFilters?.[header.id],
                          setFilterValue: (value) =>
                            setSearchFilters((p: any) => ({
                              ...p,
                              [header.id]: value,
                            })),
                          hideFilter: () => setOpenedPopup(null),
                        })}
                      </PopoverContent>
                    </Popover>
                  )}
                  {header.column.getCanSort() && (
                    <div
                      className='h-full w-5 cursor-pointer flex flex-col items-center'
                      onClick={() => handleSortState(header.id)}
                      data-applied={searchFilters.orderBy === header.id}
                    >
                      <ChevronUp
                        className={cn(
                          'h-4 w-5 text-slate-400/50',
                          searchFilters.orderBy === header.id && 'text-primary',
                          searchFilters.orderBy === header.id &&
                            searchFilters.sortOrder !== SortOrder.ASC &&
                            'hidden'
                        )}
                      />
                      <ChevronDown
                        className={cn(
                          'h-4 w-5 text-slate-400/50',
                          searchFilters.orderBy === header.id && 'text-primary',
                          searchFilters.orderBy === header.id &&
                            searchFilters.sortOrder !== SortOrder.DESC &&
                            'hidden'
                        )}
                      />
                    </div>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        <SortableContext
          items={tableInstance.getRowModel().rows.map((row) => row.id)}
          strategy={verticalListSortingStrategy}
        >
          {tableInstance.getRowModel().rows.map((row) => (
            <DraggableRow key={row.id} row={row} />
          ))}
        </SortableContext>
      </TableBody>
    </Table>
  );
}
