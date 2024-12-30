/* eslint-disable react/function-component-definition */
import { ColumnFilterComponentProps } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import React, { FC, useState } from 'react';
import { Input } from '@/shared-resources/ui/input';
import { Button } from '@/shared-resources/ui/button';

const StringFilter: FC<ColumnFilterComponentProps> = ({
  filterValue,
  setFilterValue,
  hideFilter,
}) => {
  const [value, setValue] = useState(filterValue as string);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = () => {
    setFilterValue(value);
    hideFilter?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className='flex gap-2 items-center'>
      <Input
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder='Search'
      />
      <Button onClick={handleSubmit}>
        <Search />
      </Button>
    </div>
  );
};

export const tableStringFilter = (props: ColumnFilterComponentProps) => (
  <StringFilter {...props} />
);

export default StringFilter;
