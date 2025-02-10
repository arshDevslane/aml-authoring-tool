import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RepositoryAssociation } from '@/models/entities/RepositoryAssociation';
import AmlDialog from '@/shared-resources/AmlDialog/AmlDialog';
import {
  deleteRepositoryAssociationAction,
  getRepositoryAssociationByIdAction,
} from '@/store/actions/repositoryAssociation.action';
import { useDispatch, useSelector } from 'react-redux';
import { boardEntitiesSelector } from '@/store/selectors/board.selector';
import { learnerEntitiesSelector } from '@/store/selectors/learner.selector';
import { tenantEntitiesSelector } from '@/store/selectors/tenant.selector';
import { allRepositorySelector } from '@/store/selectors/repository.selector';
import { allRepositoryAssociationsSelector } from '@/store/selectors/repositoryAssociation.selector';
import { ArrowLeftRight, Plus, Trash } from 'lucide-react';
import RepositoryAssociationAddForm from './RepositoryAssociationAddForm';
import AmlTooltip from '@/shared-resources/AmlTooltip/AmlTooltip';
import { Description } from '@/models/entities/Question';

type RepositoryAssociateDetailProps = {
  repositoryId: string;
};

const RepositoryAssociationListing = ({
  repositoryId,
}: RepositoryAssociateDetailProps) => {
  const dispatch = useDispatch();
  const [isNewUpload, setIsNewUpload] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const repositoryAssociations = useSelector(allRepositoryAssociationsSelector);
  const boardEntities = useSelector(boardEntitiesSelector);
  const learnerEntities = useSelector(learnerEntitiesSelector);
  const tenantEntities = useSelector(tenantEntitiesSelector);
  const repositoryEntities = useSelector(allRepositorySelector);

  useEffect(() => {
    if (repositoryId) {
      dispatch(getRepositoryAssociationByIdAction(repositoryId));
    }
  }, [repositoryId, dispatch]);

  const entityTypes = [
    { key: 'board_id', label: 'Board', entities: boardEntities },
    { key: 'learner_id', label: 'Learner', entities: learnerEntities },
    { key: 'tenant_id', label: 'Tenant', entities: tenantEntities },
  ];

  return (
    <div className='p-4 h-full gap-3 w-full flex flex-col max-h-[calc(100vh_-_48px)] bg-white shadow rounded-md'>
      <div>
        <h1 className='text-2xl font-bold mb-4 flex items-center gap-6 mt-8 justify-between'>
          Repository Associations
          <Button onClick={() => setIsNewUpload(true)}>
            <Plus /> New
          </Button>
        </h1>
      </div>

      {Object.values(repositoryAssociations).length ? (
        entityTypes?.map(({ key, label, entities }) =>
          Object.values(repositoryAssociations || {})
            ?.filter(
              (assoc: RepositoryAssociation) => assoc && (assoc as any)[key]
            )
            ?.map((assoc: RepositoryAssociation) => (
              <div
                key={(assoc as any)[key]}
                className='w-full flex items-center justify-between gap-2 p-2 border-2 rounded-md bg-white mt-4'
              >
                <div className='flex space-x-4 items-center'>
                  <div className='flex space-x-2 '>
                    {repositoryEntities[assoc.repository_id]?.name?.en}
                  </div>

                  <ArrowLeftRight size={16} />
                  <div className='space-x-1'>
                    <span>{label}</span>
                    <span className='font-normal'>
                      (
                      {entities === learnerEntities
                        ? entities[(assoc as any)[key]]?.name
                        : (entities[(assoc as any)[key]]?.name as Description)
                            ?.en}
                      )
                    </span>
                  </div>
                </div>
                <AmlTooltip tooltip='Remove'>
                  <Trash
                    className='fill-red-500 hover:text-red-600 text-red-500 cursor-pointer'
                    size='18px'
                    onClick={() => {
                      setDeletingId(assoc.identifier);
                      setOpenDialog(true);
                    }}
                  />
                </AmlTooltip>
              </div>
            ))
        )
      ) : (
        <div className='w-full flex justify-center items-center h-full'>
          <p>No Associations available for this repository</p>
        </div>
      )}

      <AmlDialog
        open={openDialog}
        onOpenChange={() => setOpenDialog(false)}
        title='Are you sure you want to delete this repository association?'
        description='This action cannot be undone. This will permanently delete your repository association.'
        onPrimaryButtonClick={() => {
          if (deletingId)
            dispatch(
              deleteRepositoryAssociationAction({
                repositoryAssociationId: deletingId,
                repositoryId,
              })
            );
          setOpenDialog(false);
        }}
        onSecondaryButtonClick={() => setOpenDialog(false)}
      />
      <RepositoryAssociationAddForm
        open={isNewUpload}
        onClose={() => setIsNewUpload(false)}
        repositoryId={repositoryId}
      />
    </div>
  );
};

export default RepositoryAssociationListing;
