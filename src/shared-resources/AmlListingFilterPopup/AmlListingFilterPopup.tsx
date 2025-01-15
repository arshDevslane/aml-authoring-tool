import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn, isValueEmpty } from '@/lib/utils';
import { Filter } from 'lucide-react';
import React, { useMemo } from 'react';

type AmlListingFilterPopupProps = {
  searchFilters: any;
  setSearchFilters: any;
  Component: React.FC<any>;
  componentProps?: any;
};

const AmlListingFilterPopup = ({
  searchFilters,
  setSearchFilters,
  Component,
  componentProps,
}: AmlListingFilterPopupProps) => {
  const appliedFiltersLength = useMemo(() => {
    const { page_no: pageNo, sortOrder, orderBy, ...rest } = searchFilters;

    return Object.values(rest).filter((value) => !isValueEmpty(value)).length;
  }, [searchFilters]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className='relative'>
          <Filter
            className={cn(
              'text-white',
              appliedFiltersLength > 0
                ? 'fill-primary'
                : 'fill-primary/30 hover:fill-primary/70'
            )}
          />
          Filters
          {appliedFiltersLength > 0 && (
            <div className='absolute -top-2 -right-2 bg-gray-500 h-5 w-5 rounded-full flex items-center justify-center text-white text-xs'>
              {appliedFiltersLength}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-[600px] max-h-[95%] overflow-y-auto'
        side='bottom'
        align='start'
      >
        <Component
          searchFilters={searchFilters}
          setSearchFilters={setSearchFilters}
          {...componentProps}
        />
      </PopoverContent>
    </Popover>
  );
};

export default AmlListingFilterPopup;
