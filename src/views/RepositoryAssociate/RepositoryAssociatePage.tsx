import React from 'react';
import Loader from '@/components/Loader/Loader';
import RepositoryAssociateDetailPage from '@/components/Repository/RepositoryAssociate/RepositoryAssociationListing';
import { isLoadingRepositoriesSelector } from '@/store/selectors/repository.selector';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const RepositoryAssociatePage = () => {
  const { id } = useParams();
  const isLoadingRepository = useSelector(isLoadingRepositoriesSelector);

  if (isLoadingRepository) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return <RepositoryAssociateDetailPage repositoryId={id!} />;
};
export default RepositoryAssociatePage;
