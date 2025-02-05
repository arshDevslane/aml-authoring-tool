import { Repository } from '@/models/entities/Repository';
import { RepositoryCreateUpdatePayload } from '@/components/Repository/RepositoryAddEditForm';
import { baseApiService } from './BaseApiService';

class RepositoryService {
  static getInstance(): RepositoryService {
    return new RepositoryService();
  }

  async getList(data: {
    search_query?: string;
    status?: string;
    is_active?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{
    result: {
      repositories: Repository[];
      meta: {
        offset: number;
        limit: number;
        total: number;
      };
    };
  }> {
    return baseApiService.post(
      '/api/v1/repository/list',
      'api.repository.list',
      data
    );
  }

  async getById(id: string) {
    return baseApiService.get(`/api/v1/repository/read/${id}`);
  }

  async create(repository: RepositoryCreateUpdatePayload) {
    return baseApiService.post(
      '/api/v1/repository/create',
      'api.repository.create',
      repository
    );
  }

  async update({
    repositoryId,
    data,
  }: {
    repositoryId: string;
    data: Partial<RepositoryCreateUpdatePayload>;
  }) {
    return baseApiService.post(
      `/api/v1/repository/update/${repositoryId}`,
      'api.repository.update',
      data
    );
  }

  async delete(id: string) {
    return baseApiService.post(
      `/api/v1/repository/delete/${id}`,
      'api.repository.delete',
      { id }
    );
  }

  async publish(repositoryId: string) {
    return baseApiService.post(
      `/api/v1/repository/publish/${repositoryId}`,
      'api.repository.publish'
    );
  }
}

export const repositoryService = RepositoryService.getInstance();
