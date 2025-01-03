import React, { useEffect, useMemo, useState } from 'react';
import { useTable } from '@/hooks/useTable';
import TableComponent from '@/shared-resources/TableComponent/TableComponent';
import { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash } from 'lucide-react';

import { Question } from '@/models/entities/Question';
import {
  deleteQuestionAction,
  getListQuestionsAction,
} from '@/store/actions/question.action';
import {
  filtersQuestionsSelector,
  isLoadingQuestionsSelector,
  questionsSelector,
} from '@/store/selectors/questions.selector';
import {
  convertToDate,
  getCommaSeparatedNumbers,
  toReadableFormat,
} from '@/utils/helpers/helper';
import { useDispatch, useSelector } from 'react-redux';
import AmlTooltip from '@/shared-resources/AmlTooltip/AmlTooltip';
import AmlDialog from '@/shared-resources/AmlDialog/AmlDialog';

enum DialogTypes {
  DELETE = 'delete',
  DETAILS = 'details',
}
const QuestionsListing = () => {
  const filters = useSelector(filtersQuestionsSelector);
  const isQuestionsLoading = useSelector(isLoadingQuestionsSelector);
  const { result: questions, totalCount } = useSelector(questionsSelector);
  const [searchFilters, setSearchFilters] = useState(filters);
  const [openDialog, setOpenDialog] = useState<{
    dialog: DialogTypes | null;
    open: boolean;
    questionId: string | null;
  }>({
    dialog: null,
    open: false,
    questionId: null,
  });
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
        accessorKey: 'taxonomy',
        header: 'Class',
        cell: (info) =>
          toReadableFormat(
            (info.getValue() as Question['taxonomy'])?.class?.name?.en
          ),
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
      {
        accessorKey: 'menu',
        header: 'Actions',
        // eslint-disable-next-line react/no-unstable-nested-components
        cell: ({ row }) => (
          <div className='flex gap-5 ml-6 items-center'>
            <AmlTooltip tooltip='Edit'>
              <Pencil
                className='h-5 w-5 hover:fill-slate-400 cursor-pointer'
                onClick={() =>
                  setOpenDialog({
                    dialog: DialogTypes.DETAILS,
                    open: true,
                    questionId: row.id,
                  })
                }
              />
            </AmlTooltip>
            <AmlTooltip tooltip='Delete'>
              <Trash
                data-disabled={!row.original.is_active}
                className='h-5 w-5 fill-red-500 hover:text-red-600 text-red-500 cursor-pointer [data-disabled=true]:cursor-not-allowed'
                onClick={() =>
                  setOpenDialog({
                    dialog: DialogTypes.DELETE,
                    open: true,
                    questionId: row.id,
                  })
                }
              />
            </AmlTooltip>
          </div>
        ),
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

  return (
    <div className='flex-1 flex flex-col'>
      <TableComponent
        disableDrag
        tableInstance={tableInstance}
        searchFilters={searchFilters}
        setSearchFilters={setSearchFilters}
        totalCount={totalCount}
        isLoading={isQuestionsLoading}
      />
      <AmlDialog
        open={openDialog.open && openDialog.dialog === DialogTypes.DELETE}
        onOpenChange={() =>
          setOpenDialog({ dialog: null, open: false, questionId: null })
        }
        title='Are you sure you want to delete this question?'
        description='This action cannot be undone. This will permanently delete your question.'
        onPrimaryButtonClick={() => {
          dispatch(deleteQuestionAction(openDialog.questionId!));
          setOpenDialog({ dialog: null, open: false, questionId: null });
        }}
        onSecondaryButtonClick={() => {
          setOpenDialog({ dialog: null, open: false, questionId: null });
        }}
      />
    </div>
  );
};
export default QuestionsListing;
