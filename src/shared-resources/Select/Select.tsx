import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import * as _ from 'lodash';

type SelectProps<T> = {
  onChange: (value: T) => void;
  value: T;
  renderValue?: (value?: T) => React.ReactNode;
  placeholder?: string;
  options: {
    value: string | number;
    label: string;
  }[];
  multiple?: boolean;
};

export const Select = <T extends string | number | (string | number)[]>({
  onChange,
  value,
  renderValue,
  placeholder,
  options,
  multiple,
}: SelectProps<T>) => {
  const [open, setOpen] = React.useState(false);
  const selectRef = React.useRef<HTMLButtonElement>(null);

  const handleSetValue = (val: string | number) => {
    if (!multiple) {
      onChange(val as T);
      setOpen(false);
      return;
    }

    if (!Array.isArray(value)) return;

    if (value.includes(val)) {
      onChange(value.filter((item) => item !== val) as T);
    } else {
      onChange([...value, val] as T);
    }
  };

  const checkValue = (val: string | number) => {
    if (Array.isArray(value)) {
      return value.includes(val);
    }

    return value === val;
  };

  const validatedValues = React.useMemo(() => {
    if (Array.isArray(value)) {
      return _.intersectionBy(
        value,
        options.map((option) => option.value)
      );
    }

    return options.find((option) => option.value === value)?.value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={selectRef}
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='border-input flex justify-between max-w-full border-[1px]'
        >
          <p className='truncate max-w-full'>
            {renderValue?.(validatedValues as T) ??
              (Array.isArray(validatedValues)
                ? validatedValues.join(', ')
                : validatedValues)}
          </p>
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='p-0'
        style={{ width: selectRef.current?.clientWidth }}
        ref={(ref) => {
          if (ref) {
            ref.addEventListener('wheel', (e) => e.stopPropagation());
          }
        }}
      >
        <Command>
          <CommandInput placeholder={placeholder ?? 'Select...'} />
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {options.map((listItem) => (
                <CommandItem
                  key={listItem.value}
                  value={listItem.label.toString()}
                  onSelect={() => {
                    handleSetValue(listItem.value);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      checkValue(listItem.value) ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {listItem.label}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
