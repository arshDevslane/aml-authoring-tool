import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import FormikInfiniteSelect from '@/shared-resources/FormikSelect/FormikInfiniteSelect';
import { getListBoardAction } from '@/store/actions/board.action';
import { createRepositoryAssociationAction } from '@/store/actions/repositoryAssociation.action';
import { getListTenantAction } from '@/store/actions/tenant.action';
import {
  boardEntitiesSelector,
  boardSelector,
  isLoadingBoardsSelector,
} from '@/store/selectors/board.selector';
import {
  isLoadingTenantsSelector,
  tenantSelector,
} from '@/store/selectors/tenant.selector';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';

export type RepositoryAssociationCreatePayload = {
  repository_id: string;
  board_ids: string[];
  learner_ids: string[];
  tenant_ids: string[];
};

type RepositoryAssociateDetailProps = {
  repositoryId: string;
  onClose: () => void;
  open: boolean;
};
const RepositoryAssociationAddForm = ({
  repositoryId,
  open,

  onClose,
}: RepositoryAssociateDetailProps) => {
  const dispatch = useDispatch();

  const [selectedField, setSelectedField] = useState<
    'board_ids' | 'learner_ids' | 'tenant_ids' | null
  >(null);

  const initialValues = {
    board_ids: [],
    learner_ids: [],
    tenant_ids: [],
  };

  const boardEntities = useSelector(boardEntitiesSelector);

  const { result: boards, totalCount: boardsCount } =
    useSelector(boardSelector);

  const { result: tenants, totalCount: tenantsCount } =
    useSelector(tenantSelector);
  const isLoadingBoard = useSelector(isLoadingBoardsSelector);
  const isLoadingTenant = useSelector(isLoadingTenantsSelector);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-[50%] max-h-[95%] overflow-y-auto'>
        <DialogHeader> Repository Association Upload Form</DialogHeader>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            const normalizeArray = (value: string | string[] | undefined) => {
              // Ensure value is an array, remove falsy values, and return undefined if empty
              const arr = Array.isArray(value) ? value : value ? [value] : [];
              return arr.length > 0 ? arr.filter(Boolean) : undefined;
            };

            const data = {
              repository_id: repositoryId,
              board_ids: normalizeArray(values.board_ids),
              learner_ids: normalizeArray(values.learner_ids),
              tenant_ids: normalizeArray(values.tenant_ids),
            };

            dispatch(createRepositoryAssociationAction(data));
          }}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit} className='w-full'>
              <div>
                <div>
                  <FormikInfiniteSelect
                    name='board_ids'
                    label='Boards'
                    placeholder='Select Board'
                    data={boards}
                    labelKey='name.en'
                    valueKey='identifier'
                    dispatchAction={(payload) =>
                      getListBoardAction({
                        filters: {
                          search_query: payload.value,
                          page_no: payload.page_no,
                        },
                      })
                    }
                    isLoading={isLoadingBoard}
                    totalCount={boardsCount}
                    onValueChange={() => setSelectedField('board_ids')}
                    preLoadedOptions={[boardEntities?.boards]}
                    // disabled={
                    //   !!formik.values.learner_ids || !!formik.values.tenant_ids
                    // }
                  />
                  {/* <FormikInfiniteSelect
                    name='learner_ids'
                    label='Learners'
                    placeholder='Select Learner'
                    data={boards}
                    labelKey='name.en'
                    valueKey='identifier'
                    dispatchAction={(payload) =>
                      getListBoardAction({
                        filters: {
                          search_query: payload.value,
                          page_no: payload.page_no,
                        },
                      })
                    }
                    isLoading={isLoadingBoard}
                    totalCount={boardsCount}
                    onValueChange={() => setSelectedField('learner_ids')}
                    // disabled={
                    //   !!formik.values.board_ids || !!formik.values.tenant_ids
                    // }
                    preLoadedOptions={[question?.taxonomy?.class]}
                  /> */}
                  <FormikInfiniteSelect
                    name='tenant_ids'
                    label='Tenants'
                    placeholder='Select Tenant'
                    data={tenants}
                    labelKey='name.en'
                    valueKey='identifier'
                    dispatchAction={(payload) =>
                      getListTenantAction({
                        filters: {
                          page_no: payload.page_no,
                        },
                      })
                    }
                    isLoading={isLoadingTenant}
                    totalCount={tenantsCount}
                    onValueChange={() => setSelectedField('tenant_ids')}
                    preLoadedOptions={[boardEntities?.tenants]}
                    // disabled={
                    //   !!formik.values.board_ids || !!formik.values.learner_ids
                    // }
                    multiple
                  />
                  <div className='mt-8'>
                    <Button size='lg' disabled={!selectedField} type='submit'>
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default RepositoryAssociationAddForm;
