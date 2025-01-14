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
import { Circle, Info, Pencil, Plus, Trash } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { NavLink, useLocation } from 'react-router-dom';
import AmlListingFilterPopup from '@/shared-resources/AmlListingFilterPopup/AmlListingFilterPopup';
import QuestionSetDetails from './QuestionSetDetails/QuestionSetDetails';
import QuestionSetFilters from '../QuestionSetFilters';

const coloredDot = (
  info: CellContext<QuestionSet, unknown>,
  checkFunction?: (value: any) => boolean
) => {
  const renderDot = (value: boolean) => (
    <div className='flex items-center justify-center'>
      {value ? (
        <Circle className='w-4 fill-green-500 text-green-500' />
      ) : (
        <Circle className='w-4 fill-red-500 text-red-500' />
      )}
    </div>
  );

  return typeof checkFunction === 'function'
    ? renderDot(checkFunction(info.getValue()))
    : renderDot(info.getValue() as boolean);
};

enum DialogTypes {
  DELETE = 'delete',
  DETAILS = 'details',
}

const QuestionSetListing = () => {
  const location = useLocation();
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
        accessorKey: 'status',
        header: 'Live',
        cell: (info) => coloredDot(info, (value) => value === 'live'),
      },
      {
        accessorKey: 'title',
        header: 'Title',
        cell: (info) => (info.getValue() as QuestionSet['title']).en,
        cellClassName: 'max-w-80 truncate text-left',
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
        accessorKey: 'l1_skill',
        header: 'L1 Skill',
        cell: ({ row }) => row.original?.taxonomy?.l1_skill?.name?.en ?? '--',
      },
      {
        accessorKey: 'l2_skills',
        header: 'L2 Skills',
        cell: ({ row }) =>
          row.original?.taxonomy?.l2_skill?.length
            ? row.original?.taxonomy?.l2_skill
                ?.map((l2) => l2.name.en)
                .join(', ')
            : '--',
        cellClassName: 'max-w-80 truncate',
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
        accessorKey: 'menu',
        header: 'Actions',
        // eslint-disable-next-line react/no-unstable-nested-components
        cell: ({ row }) => (
          <div className='flex gap-5 items-center justify-center'>
            <NavLink to={`${location.pathname}/${row.id}`}>
              <AmlTooltip tooltip='Details'>
                <Info className='h-5 w-5 hover:fill-slate-400 cursor-pointer' />
              </AmlTooltip>
            </NavLink>
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div className='flex items-center justify-between gap-6 mb-4'>
        <h1 className='flex items-center gap-3 text-2xl font-bold'>
          Question Sets
        </h1>
        <div className='flex items-center space-x-4'>
          <AmlListingFilterPopup
            searchFilters={searchFilters}
            setSearchFilters={setSearchFilters}
            Component={QuestionSetFilters}
          />
          <Button
            onClick={() =>
              setOpenDialog({
                dialog: DialogTypes.DETAILS,
                open: true,
                questionSetId: null,
              })
            }
          >
            <Plus /> Create
          </Button>
        </div>
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
