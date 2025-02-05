import { Repository } from '@/models/entities/Repository';
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

  async delete(id: string) {
    return baseApiService.post(
      `/api/v1/repository/delete/${id}`,
      'api.repository.delete',
      { id }
    );
  }
}

export const repositoryService = RepositoryService.getInstance();
