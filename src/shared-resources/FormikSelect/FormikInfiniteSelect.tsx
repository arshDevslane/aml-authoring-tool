import { ErrorMessage, useField } from 'formik';
import React from 'react';
import { cn } from '@/lib/utils';
import * as _ from 'lodash';
import { InfiniteSelect } from '../InfiniteSelect/InfiniteSelect';

interface FormikInfiniteSelectProps
  extends Omit<
    React.ComponentProps<typeof InfiniteSelect>,
    'onChange' | 'value'
  > {
  name: string;
  label?: string;
  required?: boolean;
  onValueChange?: (value: any) => void;
}

const FormikInfiniteSelect: React.FC<FormikInfiniteSelectProps> = (props) => {
  const { label, name, required, onValueChange, valueKey } = props;
  const [, meta, helpers] = useField(name);

  const { touched, error } = meta;
  const { setValue } = helpers;

  return (
    <div
      className={cn(
        'flex-1 flex flex-col gap-1 mb-2 overflow-hidden',
        Boolean(touched && error) && '[&_button]:!border-red-500'
      )}
    >
      {label && (
        <label className='font-medium text-sm text-primary' htmlFor={name}>
          {label} {required && <span className='text-red-500'>*</span>}
        </label>
      )}
      <InfiniteSelect
        onChange={(v) => {
          setValue(
            Array.isArray(v)
              ? v.map((item: any) => _.get(item, valueKey!)) ?? []
              : _.get(v, valueKey!) ?? ''
          );
          onValueChange?.(v);
        }}
        {...props}
      />
      <ErrorMessage
        className='text-red-500 text-xs mt-1'
        name={name}
        component='p'
      />
    </div>
  );
};

export default React.memo(FormikInfiniteSelect);
