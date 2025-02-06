/* eslint-disable react-hooks/rules-of-hooks */

import React from 'react';
import { isValueEmpty } from '@/lib/utils';
import FormikInput from '@/shared-resources/FormikInput/FormikInput';
import FormikSelect from '@/shared-resources/FormikSelect/FormikSelect';
import { PopoverClose } from '@radix-ui/react-popover';
import { Formik } from 'formik';
import * as _ from 'lodash';
import { Button } from '../ui/button';

type RepositoryFiltersProps = {
  searchFilters: any;
  setSearchFilters: any;
};

const RepositoryFilters = ({
  searchFilters,
  setSearchFilters,
}: RepositoryFiltersProps) => (
  <Formik
    initialValues={{
      search_query: searchFilters.search_query ?? '',
      status: searchFilters.status ?? '',
    }}
    onSubmit={(values) => {
      setSearchFilters((prevFilters: any) => ({
        ...(prevFilters.orderBy &&
          prevFilters.sortOrder && {
            orderBy: prevFilters.orderBy,
            sortOrder: prevFilters.sortOrder,
          }),
        ..._.omitBy(values, (v) => isValueEmpty(v)),
        page_no: 1,
      }));
    }}
  >
    {(formik) => (
      <form
        onSubmit={formik.handleSubmit}
        className='flex flex-col overflow-x-hidden p-3'
      >
        <h2 className='mb-3 font-bold uppercase'>Filters</h2>
        <FormikInput
          name='search_query'
          label='Name'
          placeholder='Search by name'
        />
        <div>
          <FormikSelect
            name='status'
            label='Status'
            placeholder='Select status'
            options={['LIVE', 'DRAFT'].map((status) => ({
              value: status.toLowerCase(),
              label: status,
            }))}
          />
        </div>
        <div className='flex justify-end'>
          <div className='w-min flex gap-3'>
            <PopoverClose asChild>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  setSearchFilters((prevFilters: any) => ({
                    page_no: 1,
                    ...(prevFilters.orderBy &&
                      prevFilters.sortOrder && {
                        orderBy: prevFilters.orderBy,
                        sortOrder: prevFilters.sortOrder,
                      }),
                  }));
                }}
              >
                Reset
              </Button>
            </PopoverClose>
            <PopoverClose asChild disabled={!formik.dirty}>
              <Button type='submit' disabled={!formik.dirty}>
                Apply
              </Button>
            </PopoverClose>
          </div>
        </div>
      </form>
    )}
  </Formik>
);

export default RepositoryFilters;
