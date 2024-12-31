/* eslint-disable jsx-a11y/label-has-associated-control */
import { getSelectionColumn, useTable } from '@/hooks/useTable';
import { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';
import { Button } from '@/shared-resources/ui/button';
import { Input } from '@/shared-resources/ui/input';
import { tableStringFilter } from '@/shared-resources/TableComponent/Filters/StringFilter';
import TableComponent from '@/shared-resources/TableComponent/TableComponent';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared-resources/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared-resources/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared-resources/ui/dropdown-menu';
import { RadioGroup, RadioGroupItem } from '@/shared-resources/ui/radio-group';
import { Switch } from '@/shared-resources/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared-resources/ui/tooltip';

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
    <div className='bg-white flex flex-col w-full min-h-screen'>
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
      <div className='flex flex-col p-3'>
        <span>Avatar</span>
        <Avatar>
          <AvatarImage src='https://github.com/shadcn.png' />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <div className='flex flex-col p-3'>
        <span>Dialog</span>
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className='flex flex-col p-3'>
        <span>Menu</span>
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='flex flex-col p-3'>
        <span>Radio Group</span>
        <RadioGroup defaultValue='option-one'>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='option-one' id='option-one' />
            <label htmlFor='option-one'>Option One</label>
          </div>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='option-two' id='option-two' />
            <label htmlFor='option-two'>Option Two</label>
          </div>
        </RadioGroup>
      </div>
      <div className='flex flex-col p-3'>
        <span>Switch</span>
        <Switch />
      </div>
      <div className='flex flex-col p-3'>
        <span>Tooltip</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>Hover</TooltipTrigger>
            <TooltipContent>
              <p>Add to library</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className='flex flex-col flex-1 p-3'>
        <span>Table</span>
        <TableComponent
          tableInstance={tableInstance}
          searchFilters={searchFilters}
          setSearchFilters={setSearchFilters}
          totalCount={100}
          totalPages={10}
        />
      </div>
    </div>
  );
};

export default DemoComps;
