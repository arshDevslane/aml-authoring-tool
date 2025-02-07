import { baseApiService } from './BaseApiService';
import { RepositoryAssociationCreatePayload } from '@/components/Repository/RepositoryAssociate/RepositoryAssociationAddForm';

class RepositoryAssociationService {
  static getInstance(): RepositoryAssociationService {
    return new RepositoryAssociationService();
  }

  async getById(id: string) {
    return baseApiService.get(`/api/v1/repository/associations/read/${id}`);
  }

  async create(repository: RepositoryAssociationCreatePayload) {
    return baseApiService.post(
      '/api/v1/repository/repository-associations',
      'api.repository.associations.create',
      repository
    );
  }

  async delete(id: string) {
    return baseApiService.post(
      `/api/v1/repository/delete/repository-associations/${id}`,
      'api.repository.association.delete',
      { id }
    );
  }
}

export const repositoryAssociationService =
  RepositoryAssociationService.getInstance();
