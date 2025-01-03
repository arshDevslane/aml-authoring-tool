import { Repository } from '@/models/entities/Repository';
import { baseApiService } from './BaseApiService';

class RepositoryService {
  static getInstance(): RepositoryService {
    return new RepositoryService();
  }

  async getList(data: {
    searchQuery?: string;
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
}

export const repositoryService = RepositoryService.getInstance();
