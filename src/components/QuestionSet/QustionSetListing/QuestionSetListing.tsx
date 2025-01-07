import { useTable } from '@/hooks/useTable';
import { QuestionSet } from '@/models/entities/QuestionSet';
import AmlDialog from '@/shared-resources/AmlDialog/AmlDialog';
import AmlTooltip from '@/shared-resources/AmlTooltip/AmlTooltip';
import TableComponent from '@/shared-resources/TableComponent/TableComponent';
import {
  deleteQuestionSetAction,
  getListQuestionSetAction,
} from '@/store/actions/questionSet.actions';
import {
  filtersQuestionSetsSelector,
  isLoadingQuestionSetsSelector,
  questionSetsSelector,
} from '@/store/selectors/questionSet.selector';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { Circle, Info, Pencil, PlusCircle, Trash } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import QuestionSetDetails from './QuestionSetDetails/QuestionSetDetails';

const coloredDot = (info: CellContext<QuestionSet, unknown>) => (
  <div className='flex items-center justify-center'>
    {info.getValue() ? (
      <Circle className='w-4 fill-green-500 text-green-500' />
    ) : (
      <Circle className='w-4 fill-red-500 text-red-500' />
    )}
  </div>
);

enum DialogTypes {
  DELETE = 'delete',
  DETAILS = 'details',
}

const QuestionSetListing = () => {
  const filters = useSelector(filtersQuestionSetsSelector);
  const isQuestionSetLoading = useSelector(isLoadingQuestionSetsSelector);
  const { result: questionSets, totalCount } =
    useSelector(questionSetsSelector);

  const [searchFilters, setSearchFilters] = useState(filters);
  const [openDialog, setOpenDialog] = useState<{
    dialog: DialogTypes | null;
    open: boolean;
    questionSetId: string | null;
  }>({
    dialog: null,
    open: false,
    questionSetId: null,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getListQuestionSetAction({
        filters: searchFilters,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFilters]);

  const columns: ColumnDef<QuestionSet>[] = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'Title',
        cell: (info) => (info.getValue() as QuestionSet['title']).en,
        cellClassName: 'max-w-64 text-left',
      },
      {
        accessorKey: 'repository',
        header: 'Repository',
        cell: (info) => (info.getValue() as QuestionSet['repository']).name.en,
      },
      {
        accessorKey: 'questions',
        header: 'Questions Count',
        cell: (info) => (info.getValue() as QuestionSet['questions']).length,
      },
      {
        accessorKey: 'tenant',
        header: 'Tenant',
        cell: (info) => info.getValue() || '--',
      },
      {
        accessorKey: 'sub_skills',
        header: 'Sub Skills',
        cell: (info) =>
          (info.getValue() as QuestionSet['sub_skills']).length > 0
            ? (info.getValue() as QuestionSet['sub_skills'])
                .map((subSkill) => subSkill.name.en)
                .join(', ')
            : '--',
      },
      {
        accessorKey: 'purpose',
        header: 'Purpose',
      },
      {
        accessorKey: 'enable_feedback',
        header: 'Show Feedback',
        cell: coloredDot,
      },
      {
        accessorKey: 'is_atomic',
        header: 'Is Atomic',
        cell: coloredDot,
      },
      {
        accessorKey: 'gradient',
        header: 'Gradient',
      },
      {
        accessorKey: 'menu',
        header: 'Actions',
        // eslint-disable-next-line react/no-unstable-nested-components
        cell: ({ row }) => (
          <div className='flex gap-5 ml-12 items-center'>
            <AmlTooltip tooltip='Details'>
              <Info
                className='h-5 w-5 hover:fill-slate-400 cursor-pointer'
                onClick={() =>
                  setOpenDialog({
                    dialog: DialogTypes.DETAILS,
                    open: true,
                    questionSetId: row.id,
                  })
                }
              />
            </AmlTooltip>
            <AmlTooltip tooltip='Edit'>
              <Pencil
                className='h-5 w-5 hover:fill-slate-400 cursor-pointer'
                onClick={() =>
                  setOpenDialog({
                    dialog: DialogTypes.DETAILS,
                    open: true,
                    questionSetId: row.id,
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
                    questionSetId: row.id,
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
    rows: questionSets,
    enableFilters: false,
    enableSorting: false,
  });

  return (
    <>
      <div className='flex items-center gap-6 mb-4'>
        <h1 className='text-2xl font-bold'>Question Sets</h1>
        <Button
          onClick={() =>
            setOpenDialog({
              dialog: DialogTypes.DETAILS,
              open: true,
              questionSetId: null,
            })
          }
        >
          <PlusCircle /> New
        </Button>
      </div>
      <div className='flex-1 flex flex-col'>
        <TableComponent
          disableDrag
          isLoading={isQuestionSetLoading}
          tableInstance={tableInstance}
          searchFilters={searchFilters}
          setSearchFilters={setSearchFilters}
          totalCount={totalCount}
        />
        <AmlDialog
          open={openDialog.open && openDialog.dialog === DialogTypes.DELETE}
          onOpenChange={() =>
            setOpenDialog({ dialog: null, open: false, questionSetId: null })
          }
          title='Are you sure you want to delete this question set?'
          description='This action cannot be undone. This will permanently delete your question set.'
          onPrimaryButtonClick={() => {
            dispatch(deleteQuestionSetAction(openDialog.questionSetId!));
            setOpenDialog({ dialog: null, open: false, questionSetId: null });
          }}
          onSecondaryButtonClick={() => {
            setOpenDialog({ dialog: null, open: false, questionSetId: null });
          }}
        />
        <Dialog
          open={openDialog.open && openDialog.dialog === DialogTypes.DETAILS}
          onOpenChange={() =>
            setOpenDialog({ dialog: null, open: false, questionSetId: null })
          }
        >
          <DialogContent className='max-w-[80%] max-h-[95%] overflow-y-auto'>
            <QuestionSetDetails
              questionSetId={openDialog.questionSetId}
              onClose={() =>
                setOpenDialog({
                  dialog: null,
                  open: false,
                  questionSetId: null,
                })
              }
            />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default QuestionSetListing;
