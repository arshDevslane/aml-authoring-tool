import React, { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useTable } from '@/hooks/useTable';
import { Repository } from '@/models/entities/Repository';
import AmlDialog from '@/shared-resources/AmlDialog/AmlDialog';
import AmlListingFilterPopup from '@/shared-resources/AmlListingFilterPopup/AmlListingFilterPopup';
import AmlTooltip from '@/shared-resources/AmlTooltip/AmlTooltip';
import TableComponent from '@/shared-resources/TableComponent/TableComponent';
import {
  deleteRepositoryAction,
  getListRepositoryAction,
  publishRepositoryAction,
  RepositoryActionPayloadType,
} from '@/store/actions/repository.action';
import {
  filtersRepositorySelector,
  isDeletingRepositorySelector,
  isLoadingRepositoriesSelector,
  isPublishingRepositorySelector,
  repositoriesSelector,
} from '@/store/selectors/repository.selector';
import {
  clearQueryParams,
  convertToDate,
  removeNullOrUndefinedValues,
} from '@/utils/helpers/helper';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import cx from 'classnames';
import { Circle, Info, Loader2, Pencil, Plus, Send, Trash } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createSearchParams,
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { Button } from '../ui/button';
import RepositoryAddEditForm from './RepositoryAddEditForm';
import RepositoryFilters from './RepositoryFilters';

const coloredDot = (info: CellContext<Repository, unknown>) => {
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

const RepositoryListing = () => {
  const { pathname, search } = useLocation();
  const params = new URLSearchParams(search);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const filters = useSelector(filtersRepositorySelector);
  const isPublishing = useSelector(isPublishingRepositorySelector);
  const isDeleting = useSelector(isDeletingRepositorySelector);
  const isRepositoryLoading = useSelector(isLoadingRepositoriesSelector);
  const { result: repositories, totalCount } =
    useSelector(repositoriesSelector);
  const [publishingId, setPublishingId] = useState<string>();
  const [deletingId, setDeletingId] = useState<string>();
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
    repositoryId: string | null;
  }>({
    dialog: null,
    open: false,
    repositoryId: null,
  });

  const publishRepository = (id: string) => {
    setPublishingId(id);
    dispatch(publishRepositoryAction(id));
  };

  const updateURL = (updatedFilters: Record<string, any>) => {
    navigateTo({
      pathname,
      search: `?${createSearchParams(clearQueryParams(updatedFilters))}`,
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
        getListRepositoryAction({
          filters: removeNullOrUndefinedValues(
            searchFilters
          ) as RepositoryActionPayloadType['filters'],
        })
      );
    }
    updateURL(searchFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFilters, isInitialized]);

  const columns: ColumnDef<Repository>[] = useMemo(
    () => [
      {
        accessorKey: 'status',
        header: 'Live',
        cell: coloredDot,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        // eslint-disable-next-line react/no-unstable-nested-components
        cell: (info) => (
          <AmlTooltip tooltip={(info.getValue() as Repository['name']).en}>
            <p className='truncate'>
              {(info.getValue() as Repository['name']).en}
            </p>
          </AmlTooltip>
        ),
        cellClassName: 'max-w-80 [&_button]:max-w-full text-left',
      },
      {
        accessorKey: 'description',
        header: 'Description',
        // eslint-disable-next-line react/no-unstable-nested-components
        cell: (info) => (
          <AmlTooltip
            tooltip={(info.getValue() as Repository['description']).en}
          >
            <p className='truncate'>
              {(info.getValue() as Repository['description']).en}
            </p>
          </AmlTooltip>
        ),
        cellClassName: 'max-w-80 [&_button]:max-w-full text-left',
      },
      {
        accessorKey: 'created_at',
        header: 'Created At',
        cell: (info) => {
          const createdAt = info.getValue() as Repository['created_at'];
          return convertToDate(createdAt);
        },
        enableSorting: false,
      },
      {
        accessorKey: 'updated_at',
        header: 'Last Updated',
        cell: (info) => {
          const updatedAt = info.getValue() as Repository['updated_at'];
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
                    onClick={() => publishRepository(row.id)}
                  />
                </AmlTooltip>
              </span>
            )}
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
                    repositoryId: row.id,
                  })
                }
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
                      repositoryId: row.id,
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
    [isPublishing, isDeleting]
  );
  const tableInstance = useTable({
    columns,
    rows: repositories,
    enableSorting: true,
  });

  return (
    <div className='p-4 h-full w-full flex flex-col bg-white shadow rounded-md'>
      <div className='flex items-center justify-between gap-6 mb-4'>
        <h1 className='flex items-center gap-3 text-2xl font-bold'>
          Repositories
        </h1>
        <div className='flex items-center space-x-4'>
          <AmlListingFilterPopup
            searchFilters={searchFilters}
            setSearchFilters={setSearchFilters}
            Component={RepositoryFilters}
          />
          <Button
            onClick={() =>
              setOpenDialog({
                dialog: DialogTypes.DETAILS,
                open: true,
                repositoryId: null,
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
          isLoading={isRepositoryLoading}
          tableInstance={tableInstance}
          searchFilters={searchFilters}
          setSearchFilters={setSearchFilters}
          totalCount={totalCount}
        />
        <AmlDialog
          open={openDialog.open && openDialog.dialog === DialogTypes.DELETE}
          onOpenChange={() =>
            setOpenDialog({ dialog: null, open: false, repositoryId: null })
          }
          title='Are you sure you want to delete this repository?'
          description='This action cannot be undone. This will permanently delete your repository.'
          onPrimaryButtonClick={() => {
            dispatch(deleteRepositoryAction(openDialog.repositoryId!));
            setOpenDialog({ dialog: null, open: false, repositoryId: null });
          }}
          onSecondaryButtonClick={() => {
            setOpenDialog({ dialog: null, open: false, repositoryId: null });
          }}
        />
        <Dialog
          open={openDialog.open && openDialog.dialog === DialogTypes.DETAILS}
          onOpenChange={() =>
            setOpenDialog({ dialog: null, open: false, repositoryId: null })
          }
        >
          <DialogContent className='max-w-[80%] max-h-[95%] overflow-y-auto'>
            <RepositoryAddEditForm
              repositoryId={openDialog.repositoryId}
              onClose={() =>
                setOpenDialog({
                  dialog: null,
                  open: false,
                  repositoryId: null,
                })
              }
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default RepositoryListing;
