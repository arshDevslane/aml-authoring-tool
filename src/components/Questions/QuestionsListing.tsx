import React, { useMemo, useState } from 'react';
import { useTable } from '@/hooks/useTable';
import TableComponent from '@/shared-resources/TableComponent/TableComponent';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { Circle, Loader2, Pencil, Send, Trash } from 'lucide-react';

import { Question } from '@/models/entities/Question';
import {
  deleteQuestionAction,
  publishQuestionAction,
} from '@/store/actions/question.action';
import {
  isDeletingSelector,
  isLoadingQuestionsSelector,
  isPublishingSelector,
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
import { useNavigate } from 'react-router-dom';
import cx from 'classnames';
import { usersSelector } from '@/store/selectors/user.selector';

enum DialogTypes {
  DELETE = 'delete',
  DETAILS = 'details',
}

const coloredDot = (info: CellContext<Question, unknown>) => {
  const status = info.getValue();
  return (
    <div className='flex items-center justify-center'>
      <Circle
        className={cx(
          `w-4`,
          status === 'live'
            ? 'fill-green-500 text-green-500'
            : 'fill-red-500 text-red-500'
        )}
      />
    </div>
  );
};

interface QuestionsListingProps {
  searchFilters?: any;
  setSearchFilters?: any;
}
const QuestionsListing: React.FC<QuestionsListingProps> = ({
  searchFilters,
  setSearchFilters,
}) => {
  const navigate = useNavigate();
  const isQuestionsLoading = useSelector(isLoadingQuestionsSelector);
  const isPublishing = useSelector(isPublishingSelector);
  const isDeleting = useSelector(isDeletingSelector);
  const usersMap = useSelector(usersSelector);
  const [publishingId, setPublishingId] = useState<string>();
  const [deletingId, setDeletingId] = useState<string>();
  const { result: questions, totalCount } = useSelector(questionsSelector);
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

  const navigateToEditQuestion = (id: string) => {
    navigate(id);
  };

  const publishQuestion = (id: string) => {
    setPublishingId(id);
    dispatch(publishQuestionAction(id));
  };

  const columns: ColumnDef<Question>[] = useMemo(
    () => [
      {
        accessorKey: 'status',
        header: 'Live',
        cell: coloredDot,
      },
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
        cellClassName: 'whitespace-nowrap',
      },

      {
        accessorKey: 'description',
        header: 'Description',
        // eslint-disable-next-line react/no-unstable-nested-components
        cell: (info) => (
          <AmlTooltip tooltip={(info.getValue() as Question['description']).en}>
            <p className='truncate'>
              {(info.getValue() as Question['description']).en}
            </p>
          </AmlTooltip>
        ),

        cellClassName: 'max-w-10 [&_button]:max-w-full text-left',
      },
      {
        accessorKey: 'repository',
        header: 'Repository',
        cell: (info) => (info.getValue() as Question['repository']).name.en,
      },

      {
        accessorKey: 'created_by',
        header: 'Created By',
        cell: (info) =>
          (info.getValue() === 'system'
            ? info.getValue()
            : `${usersMap?.[info.getValue() as string]?.first_name} ${
                usersMap?.[info.getValue() as string]?.last_name
              }`) as Question['created_by'],
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
        enableSorting: false,
      },
      {
        accessorKey: 'menu',
        header: 'Actions',
        // eslint-disable-next-line react/no-unstable-nested-components
        cell: ({ row }) => (
          <div className='flex gap-5 items-center justify-center'>
            {isPublishing && row.id === publishingId ? (
              <Loader2 className='animate-spin' />
            ) : (
              <span
                className={cx(
                  'm-0 p-0 h-5 w-5',
                  row.original.status !== 'draft'
                    ? 'invisible pointer-events-none'
                    : ''
                )}
              >
                <AmlTooltip tooltip='Publish'>
                  <Send
                    className='h-5 w-5 hover:fill-slate-400 cursor-pointer'
                    onClick={() => publishQuestion(row.id)}
                  />
                </AmlTooltip>
              </span>
            )}
            <AmlTooltip tooltip='Edit'>
              <Pencil
                className='h-5 w-5 hover:fill-slate-400 cursor-pointer'
                onClick={() => navigateToEditQuestion(row.id)}
              />
            </AmlTooltip>

            {isDeleting && row.id === deletingId ? (
              <Loader2 className='animate-spin' />
            ) : (
              <AmlTooltip tooltip='Delete'>
                <Trash
                  data-disabled={!row.original.is_active}
                  className='h-5 w-5 fill-red-500 hover:text-red-600 text-red-500 cursor-pointer [data-disabled=true]:cursor-not-allowed'
                  onClick={() => {
                    setOpenDialog({
                      dialog: DialogTypes.DELETE,
                      open: true,
                      questionId: row.id,
                    });
                    setDeletingId(row.id);
                  }}
                />
              </AmlTooltip>
            )}
          </div>
        ),
        enableSorting: false,
      },
    ],
    [isPublishing, isDeleting, usersMap]
  );
  const tableInstance = useTable({
    columns,
    rows: questions,
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
