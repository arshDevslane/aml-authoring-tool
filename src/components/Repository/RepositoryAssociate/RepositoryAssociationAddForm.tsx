import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import FormikInfiniteSelect from '@/shared-resources/FormikSelect/FormikInfiniteSelect';
import { getListBoardAction } from '@/store/actions/board.action';
import { createRepositoryAssociationAction } from '@/store/actions/repositoryAssociation.action';
import { getListTenantAction } from '@/store/actions/tenant.action';
import {
  boardSelector,
  isLoadingBoardsSelector,
} from '@/store/selectors/board.selector';
import {
  isLoadingTenantsSelector,
  tenantSelector,
} from '@/store/selectors/tenant.selector';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  isLoadingLearnersSelector,
  learnerSelector,
} from '@/store/selectors/learner.selector';
import { getListLearnerAction } from '@/store/actions/learner.action';
import _ from 'lodash';

export type RepositoryAssociationCreatePayload = {
  repository_id: string;
  board_ids: string[];
  learner_ids: string[];
  tenant_ids: string[];
};

type RepositoryAssociateDetailProps = {
  repositoryId: string | null;
  onClose: () => void;
  open: boolean;
};
const RepositoryAssociationAddForm = ({
  repositoryId,
  open,

  onClose,
}: RepositoryAssociateDetailProps) => {
  const dispatch = useDispatch();

  const initialValues = {
    board_ids: [],
    learner_ids: [],
    tenant_ids: [],
  };

  const { result: boards, totalCount: boardsCount } =
    useSelector(boardSelector);
  const { result: learners, totalCount: learnersCount } =
    useSelector(learnerSelector);
  const { result: tenants, totalCount: tenantsCount } =
    useSelector(tenantSelector);
  const isLoadingBoard = useSelector(isLoadingBoardsSelector);
  const isLoadingTenant = useSelector(isLoadingTenantsSelector);
  const isLoadingLearner = useSelector(isLoadingLearnersSelector);
  const [isFormSubmitted, setIsFormSubmitted] = React.useState(false);

  useEffect(() => {
    if (isFormSubmitted) {
      setIsFormSubmitted(false);
      onClose();
    }
  }, [isFormSubmitted, onClose]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-[50%] max-h-[95%] overflow-y-auto'>
        <DialogHeader> Repository Association Upload Form</DialogHeader>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            setIsFormSubmitted(true);

            const data = {
              repository_id: repositoryId,
              board_ids: values.board_ids,
              learner_ids: values.learner_ids,
              tenant_ids: values.tenant_ids,
            };

            dispatch(
              createRepositoryAssociationAction(
                _.omitBy(
                  data,
                  (value) => Array.isArray(value) && value.length === 0
                )
              )
            );
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
                    disabled={
                      !!formik.values.tenant_ids?.length ||
                      !!formik.values.learner_ids.length
                    }
                    multiple
                  />
                  <FormikInfiniteSelect
                    name='learner_ids'
                    label='Learners'
                    placeholder='Select Learner'
                    data={learners}
                    labelKey='name'
                    valueKey='identifier'
                    dispatchAction={(payload) =>
                      getListLearnerAction({
                        filters: {
                          search_query: payload.value,
                          page_no: payload.page_no,
                        },
                      })
                    }
                    isLoading={isLoadingLearner}
                    totalCount={learnersCount}
                    disabled={
                      !!formik.values.board_ids?.length ||
                      !!formik.values.tenant_ids.length
                    }
                    multiple
                  />
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
                          search_query: payload.value,
                          page_no: payload.page_no,
                        },
                      })
                    }
                    isLoading={isLoadingTenant}
                    totalCount={tenantsCount}
                    disabled={
                      !!formik.values.board_ids?.length ||
                      !!formik.values.learner_ids.length
                    }
                    multiple
                  />
                  <div className='mt-8'>
                    <Button
                      size='lg'
                      disabled={!formik.dirty || !formik.isValid}
                      type='submit'
                    >
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
