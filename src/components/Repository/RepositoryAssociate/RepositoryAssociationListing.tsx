import React from 'react';
import { Button } from '@/components/ui/button';
import { RepositoryAssociation } from '@/models/entities/RepositoryAssociation';
import AmlDialog from '@/shared-resources/AmlDialog/AmlDialog';
import {
  deleteRepositoryAssociationAction,
  getRepositoryAssociationByIdAction,
} from '@/store/actions/repositoryAssociation.action';
import { boardEntitiesSelector } from '@/store/selectors/board.selector';
import { allRepositoryAssociationsSelector } from '@/store/selectors/repositoryAssociation.selector';
import { Plus, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RepositoryAssociationAddForm from './RepositoryAssociationAddForm';
import { learnerEntitiesSelector } from '@/store/selectors/learner.selector';
import { tenantEntitiesSelector } from '@/store/selectors/tenant.selector';
import AmlTooltip from '@/shared-resources/AmlTooltip/AmlTooltip';

type RepositoryAssociateDetailProps = {
  repositoryId: string;
};

enum DialogTypes {
  DELETE = 'delete',
}

const RepositoryAssociationListing = ({
  repositoryId,
}: RepositoryAssociateDetailProps) => {
  const dispatch = useDispatch();
  const [isNewUpload, setIsNewUpload] = useState(false);
  const [deletingId, setDeletingId] = useState<string>();

  const repositoryAssociationsEntities = useSelector(
    allRepositoryAssociationsSelector
  );
  const repositoryAssociations = Object.values(
    repositoryAssociationsEntities
  ).filter(
    (repositoryAssociation: RepositoryAssociation) =>
      repositoryAssociation.repository_id === repositoryId
  );

  const boardEntities = useSelector(boardEntitiesSelector);
  const learnerEntities = useSelector(learnerEntitiesSelector);
  const tenantEntities = useSelector(tenantEntitiesSelector);

  useEffect(() => {
    if (repositoryId) {
      dispatch(getRepositoryAssociationByIdAction(repositoryId));
    }
  }, [repositoryId, dispatch]);

  const [openDialog, setOpenDialog] = useState<{
    dialog: DialogTypes | null;
    open: boolean;
    repositoryId: string | null;
  }>({
    dialog: null,
    open: false,
    repositoryId: null,
  });

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

      {/* Display Boards only if they exist */}
      {repositoryAssociations.some((assoc) => assoc.board_id) && (
        <div>
          <h2 className='text-xl font-semibold mb-2'>Boards</h2>
          {repositoryAssociations.map(
            (repositoryAssociation: RepositoryAssociation) =>
              repositoryAssociation.board_id && (
                <div
                  key={repositoryAssociation.board_id}
                  className='w-full flex items-center justify-between gap-2 p-2 border-2 rounded-md bg-white mt-4'
                >
                  <span className='font-normal'>
                    {boardEntities[repositoryAssociation.board_id]?.name?.en}
                  </span>
                  <AmlTooltip tooltip='Remove'>
                    <Trash
                      className='fill-red-500 hover:text-red-600 text-red-500 cursor-pointer'
                      size='18px'
                    />
                  </AmlTooltip>
                </div>
              )
          )}
        </div>
      )}

      {/* Display Learners only if they exist */}
      {repositoryAssociations.some((assoc) => assoc.learner_id) && (
        <div>
          <h2 className='text-xl font-semibold mb-2'>Learners</h2>
          {repositoryAssociations.map(
            (repositoryAssociation: RepositoryAssociation) =>
              repositoryAssociation.learner_id && (
                <div
                  key={repositoryAssociation.learner_id}
                  className='w-full flex items-center justify-between gap-2 p-2 border-2 rounded-md bg-white mt-4'
                >
                  <span className='font-normal'>
                    {learnerEntities[repositoryAssociation.learner_id]?.name}
                  </span>
                  <AmlTooltip tooltip='Remove'>
                    <Trash
                      className='fill-red-500 hover:text-red-600 text-red-500 cursor-pointer'
                      size='18px'
                    />
                  </AmlTooltip>
                </div>
              )
          )}
        </div>
      )}

      {/* Display Tenants only if they exist */}
      {repositoryAssociations.some((assoc) => assoc.tenant_id) && (
        <div>
          <h2 className='text-xl font-semibold mb-2'>Tenants</h2>
          {repositoryAssociations.map(
            (repositoryAssociation: RepositoryAssociation) =>
              repositoryAssociation.tenant_id && (
                <div
                  key={repositoryAssociation.tenant_id}
                  className='w-full flex items-center justify-between gap-2 p-2 border-2 rounded-md bg-white mt-4'
                >
                  <span className='font-normal'>
                    {tenantEntities[repositoryAssociation.tenant_id]?.name?.en}
                  </span>{' '}
                  <AmlTooltip tooltip='Remove'>
                    <Trash
                      className='fill-red-500 hover:text-red-600 text-red-500 cursor-pointer'
                      size='18px'
                      onClick={() => {
                        setOpenDialog({
                          dialog: DialogTypes.DELETE,
                          open: true,
                          repositoryId: repositoryAssociation?.identifier,
                        });
                        setDeletingId(repositoryAssociation?.identifier);
                      }}
                    />
                  </AmlTooltip>
                </div>
              )
          )}
        </div>
      )}

      <RepositoryAssociationAddForm
        open={isNewUpload}
        onClose={() => setIsNewUpload(false)}
        repositoryId={repositoryId}
      />

      <AmlDialog
        open={openDialog.open && openDialog.dialog === DialogTypes.DELETE}
        onOpenChange={() =>
          setOpenDialog({ dialog: null, open: false, repositoryId: null })
        }
        title='Are you sure you want to delete this repository association?'
        description='This action cannot be undone. This will permanently delete your repository association.'
        onPrimaryButtonClick={() => {
          dispatch(deleteRepositoryAssociationAction(deletingId!));
          setOpenDialog({ dialog: null, open: false, repositoryId: null });
        }}
        onSecondaryButtonClick={() => {
          setOpenDialog({ dialog: null, open: false, repositoryId: null });
        }}
      />
    </div>
  );
};

export default RepositoryAssociationListing;
