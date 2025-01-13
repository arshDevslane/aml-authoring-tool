import * as React from 'react';
import { Check, ChevronsUpDown, Search, X } from 'lucide-react';

import { cn, debounce } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useDispatch } from 'react-redux';
import { PaginationLimit } from '@/enums/tableEnums';
import * as _ from 'lodash';
import Loader from '@/components/Loader/Loader';

type InfiniteSelectProps = {
  onChange: (value: any) => void;
  placeholder?: string;
  data: any[];
  multiple?: boolean;
  dispatchAction: (data: { value: string; page_no: number }) => {
    type: string;
    payload: any;
  };
  labelKey?: string;
  valueKey?: string;
  isLoading: boolean;
  totalCount: number;
  preLoadedOptions?: any[];
};

export const InfiniteSelect = ({
  onChange,
  placeholder,
  data,
  multiple,
  dispatchAction,
  labelKey,
  valueKey,
  isLoading,
  totalCount,
  preLoadedOptions = [],
}: InfiniteSelectProps) => {
  const [open, setOpen] = React.useState(false);
  const [searchFilters, setSearchFilters] = React.useState({
    value: '',
    page_no: 1,
  });
  const [searchValue, setSearchValue] = React.useState('');
  const [options, setOptions] = React.useState<any[]>([]);
  const [values, setValues] = React.useState<any>(() => {
    if (!multiple) return preLoadedOptions[0];
    return preLoadedOptions;
  });

  const selectedValues = React.useMemo(() => {
    if (!multiple) return _.get(values, valueKey ?? '');
    return values.map((item: any) => _.get(item, valueKey ?? ''));
  }, [multiple, values, valueKey]);

  React.useEffect(() => {
    if (data.length) {
      const newDataArray = structuredClone(options);
      const availableOptions = (multiple ? values : [values]).filter(
        (option: any) => {
          const itemLabel = _.get(option, labelKey ?? '');

          if (itemLabel?.includes(searchFilters.value)) return true;
          return false;
        }
      );

      newDataArray.push(...data);
      const newOptions = _.differenceBy(
        availableOptions,
        newDataArray,
        valueKey ?? ''
      );

      newDataArray.unshift(...newOptions);

      newDataArray.sort((a: any, b: any) => {
        const itemValueA = _.get(a, valueKey ?? '');
        const itemValueB = _.get(b, valueKey ?? '');

        const inA = (selectedValues ?? []).includes(itemValueA);
        const inB = (selectedValues ?? []).includes(itemValueB);

        if (inA && inB) return 0;
        if (inA) return -1;
        if (inB) return 1;
        return 0;
      });

      setOptions(newDataArray);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const nextPageRef = React.useRef<HTMLDivElement | null>(null);

  const dispatch = useDispatch();

  const selectRef = React.useRef<HTMLButtonElement>(null);
  const totalPages = Math.ceil(totalCount / PaginationLimit.PAGE_SIZE);

  React.useEffect(() => {
    if (open && !isLoading) {
      dispatch(dispatchAction(searchFilters));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, searchFilters]);

  React.useEffect(() => {
    if (!open || searchFilters.page_no === totalPages) return;

    const element = nextPageRef.current;
    if (!element) return;

    const handleNextPage = () => {
      if (
        Math.ceil(element.scrollTop + element.offsetHeight) >=
        element.scrollHeight
      ) {
        setSearchFilters((prev) => ({
          ...prev,
          page_no: searchFilters.page_no + 1,
        }));
      }
    };

    element.addEventListener('scroll', handleNextPage);

    // eslint-disable-next-line consistent-return
    return () => {
      element.removeEventListener('scroll', handleNextPage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, options]);

  const handleSetValue = (val: any) => {
    if (!multiple) {
      onChange(val);
      setValues(val);
      setOpen(false);
      return;
    }

    if (!Array.isArray(selectedValues)) return;

    if (selectedValues.includes(_.get(val, valueKey ?? ''))) {
      const filteredVals = values.filter(
        (item: any) =>
          _.get(item, valueKey ?? '') !== _.get(val, valueKey ?? '')
      );
      setValues(filteredVals);
      onChange(filteredVals);
    } else {
      onChange([...values, val]);
      setValues([...values, val]);
    }
  };

  const handleReset = () => {
    onChange(multiple ? [] : '');
    setValues(multiple ? [] : '');
    setOpen(false);
  };

  const checkValue = (val: string | number) => {
    if (multiple) {
      return selectedValues.includes(val);
    }

    return selectedValues === val;
  };
  const handleDebouncedSearch = React.useMemo(
    () =>
      debounce((e: string) => {
        setSearchFilters({ value: e, page_no: 1 });
      }, 300),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions([]);
    setSearchValue(e.target.value);
    handleDebouncedSearch(e.target.value);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        setOptions([]);
        setSearchValue('');
        setSearchFilters({ value: '', page_no: 1 });
      }}
    >
      <div className='flex flex-1 items-center gap-2 overflow-hidden'>
        <PopoverTrigger asChild>
          <Button
            ref={selectRef}
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='border-input flex justify-between flex-1 overflow-hidden'
          >
            <p className='truncate max-w-full'>
              {multiple
                ? values
                    .map((item: any) => _.get(item, labelKey ?? ''))
                    .join(', ')
                : _.get(values, labelKey ?? '')}
            </p>
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <X
          className='text-red-400 h-5 w-5 cursor-pointer'
          onClick={handleReset}
        />
      </div>
      <PopoverContent
        className='p-0'
        style={{ width: selectRef.current?.clientWidth }}
        ref={(ref) => {
          if (ref) {
            ref.addEventListener('wheel', (e) => e.stopPropagation());
          }
        }}
      >
        <div>
          <div className='flex items-center border-b px-3'>
            <Search className='mr-2 h-4 w-4 shrink-0 opacity-50' />
            <input
              className='flex h-10 w-full focus-visible:ring-none rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'
              defaultValue={searchValue}
              onChange={handleSearch}
              placeholder={placeholder ?? 'Select...'}
            />
          </div>
          {options.length || isLoading ? (
            <div className='overflow-hidden p-1 text-foreground'>
              <div
                className='max-h-[300px] overflow-y-auto overflow-x-hidden'
                ref={nextPageRef}
              >
                {options.map((listItem) => {
                  const itemValue = _.get(listItem, valueKey ?? '');
                  const itemLabel = _.get(listItem, labelKey ?? '');

                  const isSelected = checkValue(itemValue);

                  return (
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
                    <p
                      className='hover:bg-blue-50/80 flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0'
                      key={itemValue}
                      data-selected={isSelected}
                      onClick={() => {
                        handleSetValue(listItem);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          isSelected ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {itemLabel}
                    </p>
                  );
                })}
                {isLoading && (
                  <p className='relative min-h-8 hover:bg-blue-50/80 flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 justify-center'>
                    <Loader />
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className='py-6 text-center text-sm'>No item found.</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
