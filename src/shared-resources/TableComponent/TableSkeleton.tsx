/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/function-component-definition */
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SortOrder } from '@/enums/tableEnums';
import { cn, isValueEmpty } from '@/lib/utils';
import { flexRender } from '@tanstack/react-table';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import React, { useState } from 'react';
import { TableComponentProps } from './types/TableComponent.types';
import TableComponentBody from './TableComponentBody';

export default function TableSkeleton<T, S extends Record<string, any>>({
  tableInstance,
  searchFilters,
  setSearchFilters,
  disableDrag,
  isLoading,
}: TableComponentProps<T, S>) {
  const [openedPopup, setOpenedPopup] = useState<string | null>(null);

  const handleSortState = (columnId: string) => {
    if (searchFilters?.orderBy === columnId) {
      const orderBy =
        searchFilters.sortOrder === SortOrder.DESC ? null : columnId;

      if (orderBy) {
        setSearchFilters?.((p: any) => ({
          ...p,
          orderBy,
          sortOrder:
            p.sortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC,
        }));
      } else {
        setSearchFilters?.((p: any) => ({
          ...p,
          orderBy: null,
          sortOrder: null,
        }));
      }
    } else {
      setSearchFilters?.((p: any) => ({
        ...p,
        orderBy: columnId,
        sortOrder: SortOrder.ASC,
      }));
    }
  };

  return (
    <Table
      className={cn(
        (isLoading || !tableInstance.getRowModel().rows.length) && 'h-full'
      )}
    >
      <TableHeader>
        {tableInstance.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className='[&_button_svg[data-applied=false]]:hover:fill-primary/70 [&_button_svg[data-applied=true]]:hover:fill-primary [&_div[data-applied=false]_svg]:hover:text-primary/70 [&_div[data-applied=true]_svg]:hover:text-primary'
              >
                <div className='flex gap-3 items-center justify-center whitespace-nowrap'>
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
                            setSearchFilters?.((p: any) => ({
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
                      data-applied={searchFilters?.orderBy === header.id}
                    >
                      <ChevronUp
                        className={cn(
                          'h-4 w-5 text-slate-400/50',
                          searchFilters?.orderBy === header.id &&
                            'text-primary',
                          searchFilters?.orderBy === header.id &&
                            searchFilters.sortOrder !== SortOrder.ASC &&
                            'hidden'
                        )}
                      />
                      <ChevronDown
                        className={cn(
                          'h-4 w-5 text-slate-400/50',
                          searchFilters?.orderBy === header.id &&
                            'text-primary',
                          searchFilters?.orderBy === header.id &&
                            searchFilters?.sortOrder !== SortOrder.DESC &&
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
        <TableComponentBody
          isLoading={isLoading}
          rows={tableInstance.getRowModel().rows}
          columnsLength={tableInstance.getAllColumns().length}
          disableDrag={disableDrag}
        />
      </TableBody>
    </Table>
  );
}
