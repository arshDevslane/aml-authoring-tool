import { Input } from '@/components/ui/input';
import { ErrorMessage, useField } from 'formik';
import React from 'react';

interface FormikInputProps
  extends Omit<React.ComponentProps<'input'>, 'onChange' | 'value'> {
  name: string;
  label?: string;
  required?: boolean;
}

const FormikInput: React.FC<FormikInputProps> = (props) => {
  const { label, name, required } = props;
  const [, meta, helpers] = useField(name);

  const { value, touched, error } = meta;
  const { setValue, setTouched } = helpers;

  return (
    <div className='relative flex w-full flex-col gap-1 mb-2'>
      {label && (
        <label className='font-medium text-sm text-primary' htmlFor={name}>
          {label} {required && <span className='text-red-500'>*</span>}
        </label>
      )}
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setTouched(true)}
        placeholder={label}
        hasError={Boolean(touched && error)}
        {...props}
        required={false}
      />
      {/* This wrapper for error message allows for conditional visibility without disturbing layout */}
      <ErrorMessage
        className='absolute text-red-500 text-xs mt-1 top-full left-0 w-full'
        name={name}
        component='p'
      />
    </div>
  );
};

export default React.memo(FormikInput);
