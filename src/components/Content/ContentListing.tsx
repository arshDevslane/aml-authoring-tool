import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useTable } from '@/hooks/useTable';
import { Content } from '@/models/entities/Content';
import AmlDialog from '@/shared-resources/AmlDialog/AmlDialog';
import AmlListingFilterPopup from '@/shared-resources/AmlListingFilterPopup/AmlListingFilterPopup';
import AmlTooltip from '@/shared-resources/AmlTooltip/AmlTooltip';
import TableComponent from '@/shared-resources/TableComponent/TableComponent';
import {
  ContentActionPayloadType,
  deleteContentAction,
  getListContentAction,
} from '@/store/actions/content.actions';
import {
  contentSelector,
  filtersContentSelector,
  isLoadingContentSelector,
} from '@/store/selectors/content.selector';
import { convertToDate, toReadableFormat } from '@/utils/helpers/helper';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { Circle, Plus, Trash } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import cx from 'classnames';
import { Button } from '../ui/button';
import ContentFilters from './ContentFilters';
import ContentListDetail from './ContentAddEditForm';

const coloredDot = (info: CellContext<Content, unknown>) => {
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

enum DialogTypes {
  DELETE = 'delete',
  DETAILS = 'details',
}

const ContentListing = () => {
  const { pathname, search } = useLocation();
  const params = new URLSearchParams(search);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const filters = useSelector(filtersContentSelector);
  const isContentLoading = useSelector(isLoadingContentSelector);
  const { result: contents, totalCount } = useSelector(contentSelector);
  const [isInitialized, setIsInitialized] = useState(false);

  const [searchFilters, setSearchFilters] = useState<
    Record<string, any> & { page_no: number }
  >(() => {
    const initialFilters: Record<string, any> & { page_no: number } = {
      ...filters,
      page_no: 1,
    };
    params.forEach((value, key) => {
      initialFilters[key] = key === 'page_no' ? +value : value;
    });
    return initialFilters;
  });
  const [openDialog, setOpenDialog] = useState<{
    dialog: DialogTypes | null;
    open: boolean;
    contentId: string | null;
  }>({
    dialog: null,
    open: false,
    contentId: null,
  });

  const updateURL = (updatedFilters: Record<string, any>) => {
    navigateTo({
      pathname,
      search: `?${createSearchParams(
        Object.entries(updatedFilters)?.map(([key, value]) => [
          key,
          value?.toString(),
        ]) as any
      )}`,
    });
  };

  useEffect(() => {
    if (!isInitialized) {
      const urlFilters: Record<string, any> = {};
      params.forEach((value, key) => {
        urlFilters[key] = key === 'page_no' ? +value : value;
      });

      setSearchFilters((prevFilters) => ({
        ...prevFilters,
        ...urlFilters,
      }));
      setIsInitialized(true);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [search]);

  useEffect(() => {
    if (isInitialized) {
      dispatch(
        getListContentAction({
          filters: searchFilters as ContentActionPayloadType['filters'],
        })
      );
    }
    updateURL(searchFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFilters, isInitialized]);

  const columns: ColumnDef<Content>[] = useMemo(
    () => [
      {
        accessorKey: 'status',
        header: 'Status',
        cell: coloredDot,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        // eslint-disable-next-line react/no-unstable-nested-components
        cell: (info) => (
          <AmlTooltip tooltip={(info.getValue() as Content['name']).en}>
            <p className='truncate'>
              {(info.getValue() as Content['name']).en}
            </p>
          </AmlTooltip>
        ),
        cellClassName: 'max-w-80 [&_button]:max-w-full text-left',
      },
      {
        accessorKey: 'taxonomy',
        header: 'Class',
        cell: (info) =>
          toReadableFormat(
            (info.getValue() as Content['taxonomy'])?.class?.name?.en
          ),
      },
      {
        accessorKey: 'repository',
        header: 'Repository',
        cell: (info) => (info.getValue() as Content['repository']).name.en,
      },
      {
        accessorKey: 'l1_skill',
        header: 'L1 Skill',
        cell: ({ row }) => row.original?.taxonomy?.l1_skill?.name?.en ?? '--',
      },
      {
        accessorKey: 'created_at',
        header: 'Created At',
        cell: (info) => {
          const createdAt = info.getValue() as Content['created_at'];
          return convertToDate(createdAt);
        },
        enableSorting: false,
      },
      {
        accessorKey: 'updated_at',
        header: 'Last Updated',
        cell: (info) => {
          const updatedAt = info.getValue() as Content['updated_at'];
          return convertToDate(updatedAt);
        },
        enableSorting: false,
      },
      {
        accessorKey: 'menu',
        header: 'Actions',
        // eslint-disable-next-line react/no-unstable-nested-components
        cell: ({ row }) => (
          <div className='flex gap-5 items-center justify-center'>
            {/* <AmlTooltip tooltip='Edit'>
              <Pencil
                className='h-5 w-5 hover:fill-slate-400 cursor-pointer'
                onClick={() =>
                  setOpenDialog({
                    dialog: DialogTypes.DETAILS,
                    open: true,
                    contentId: row.id,
                  })
                }
              />
            </AmlTooltip> */}
            <AmlTooltip tooltip='Delete'>
              <Trash
                data-disabled={!row.original.is_active}
                className='h-5 w-5 fill-red-500 hover:text-red-600 text-red-500 cursor-pointer [data-disabled=true]:cursor-not-allowed'
                onClick={() =>
                  setOpenDialog({
                    dialog: DialogTypes.DELETE,
                    open: true,
                    contentId: row.id,
                  })
                }
              />
            </AmlTooltip>
          </div>
        ),
        enableSorting: false,
      },
    ],
    []
  );
  const tableInstance = useTable({
    columns,
    rows: contents,
    enableSorting: true,
  });

  return (
    <div className='p-4 h-full w-full flex flex-col bg-white shadow rounded-md'>
      <div className='flex items-center justify-between gap-6 mb-4'>
        <h1 className='flex items-center gap-3 text-2xl font-bold'>Content</h1>
        <div className='flex items-center space-x-4'>
          <AmlListingFilterPopup
            searchFilters={searchFilters}
            setSearchFilters={setSearchFilters}
            Component={ContentFilters}
          />
          <Button
            onClick={() =>
              setOpenDialog({
                dialog: DialogTypes.DETAILS,
                open: true,
                contentId: null,
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
          isLoading={isContentLoading}
          tableInstance={tableInstance}
          searchFilters={searchFilters}
          setSearchFilters={setSearchFilters}
          totalCount={totalCount}
        />
        <AmlDialog
          open={openDialog.open && openDialog.dialog === DialogTypes.DELETE}
          onOpenChange={() =>
            setOpenDialog({ dialog: null, open: false, contentId: null })
          }
          title='Are you sure you want to delete this content?'
          description='This action cannot be undone. This will permanently delete your content.'
          onPrimaryButtonClick={() => {
            dispatch(deleteContentAction(openDialog.contentId!));
            setOpenDialog({ dialog: null, open: false, contentId: null });
          }}
          onSecondaryButtonClick={() => {
            setOpenDialog({ dialog: null, open: false, contentId: null });
          }}
        />
        <Dialog
          open={openDialog.open && openDialog.dialog === DialogTypes.DETAILS}
          onOpenChange={() =>
            setOpenDialog({ dialog: null, open: false, contentId: null })
          }
        >
          <DialogContent className='max-w-[80%] max-h-[95%] overflow-y-auto'>
            <ContentListDetail
              contentId={openDialog.contentId}
              onClose={() =>
                setOpenDialog({
                  dialog: null,
                  open: false,
                  contentId: null,
                })
              }
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ContentListing;
