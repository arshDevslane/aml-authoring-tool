import React, { useEffect, useMemo, useState } from 'react';
import { useTable } from '@/hooks/useTable';
import TableComponent from '@/shared-resources/TableComponent/TableComponent';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { Circle } from 'lucide-react';

import { Question } from '@/models/entities/Question';
import { getListQuestionsAction } from '@/store/actions/question.action';
import {
  filtersQuestionsSelector,
  isLoadingQuestionsSelector,
  questionsSelector,
  totalCountQuestionsSelector,
} from '@/store/selectors/questions.selector';
import {
  convertToDate,
  getCommaSeparatedNumbers,
} from '@/utils/helpers/helper';
import { useDispatch, useSelector } from 'react-redux';

const coloredDot = (info: CellContext<Question, unknown>) => (
  <div className='flex items-center justify-center w-12'>
    {info.getValue() ? (
      <Circle className='w-4 fill-green-500 text-green-500' />
    ) : (
      <Circle className='w-4 fill-red-500 text-red-500' />
    )}
  </div>
);
const QuestionsListing = () => {
  const totalCount = useSelector(totalCountQuestionsSelector);
  const filters = useSelector(filtersQuestionsSelector);
  const isQuestionsLoading = useSelector(isLoadingQuestionsSelector);
  const questions = useSelector(questionsSelector);
  const [searchFilters, setSearchFilters] = useState(filters);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getListQuestionsAction({
        filters: searchFilters,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFilters]);
  const columns: ColumnDef<Question>[] = useMemo(
    () => [
      {
        accessorKey: 'is_active',
        header: 'Is Active',
        cell: coloredDot,
      },
      {
        accessorKey: 'operation',
        header: 'Operation',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'question_type',
        header: 'Question Type',
        cell: (info) => info.getValue() as Question['question_type'],
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => info.getValue() as Question['status'],
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: (info) => (info.getValue() as Question['description']).en,
      },
      {
        accessorKey: 'repository',
        header: 'Repository',
        cell: (info) => (info.getValue() as Question['repository']).name.en,
      },

      {
        accessorKey: 'created_by',
        header: 'Created By',
        cell: (info) => info.getValue() as Question['created_by'],
      },
      {
        accessorKey: 'created_at',
        header: 'Created At',
        cell: (info) => {
          const createdAt = info.getValue() as Question['created_at'];
          return convertToDate(createdAt);
        },
      },
      {
        accessorKey: 'question_body',
        header: 'Numbers',
        cell: (info) => {
          const numbers = (info.getValue() as Question['question_body'])
            ?.numbers;
          return getCommaSeparatedNumbers(numbers || {});
        },
      },
    ],
    []
  );
  const tableInstance = useTable({
    columns,
    rows: questions,
    enableFilters: false,
    enableSorting: false,
  });
  if (isQuestionsLoading) {
    return <div className='flex items-center justify-center'>Loading...</div>;
  }
  return (
    <div className='flex-1 flex '>
      <TableComponent
        totalPages={1}
        tableInstance={tableInstance}
        searchFilters={searchFilters}
        setSearchFilters={setSearchFilters}
        totalCount={totalCount}
      />
      {/* <AmlDialog
        open={openDeleteDialog.open}
        onOpenChange={() =>
          setOpenDeleteDialog({ open: false, questionSetId: null })
        }
        title='Are you sure you want to delete this question set?'
        description='This action cannot be undone. This will permanently delete your question set.'
        onPrimaryButtonClick={() => {
          setOpenDeleteDialog({ open: false, questionSetId: null });
        }}
        onSecondaryButtonClick={() => {
          setOpenDeleteDialog({ open: false, questionSetId: null });
        }}
      /> */}
    </div>
  );
};
export default QuestionsListing;
