import { Learner } from '@/models/entities/Learner';
import { baseApiService } from './BaseApiService';

class LearnerService {
  static getInstance(): LearnerService {
    return new LearnerService();
  }

  async getList(data: {
    search_query?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    result: {
      learners: Learner[];
      meta: {
        total: number;
      };
    };
  }> {
    return baseApiService.post(`api/v1/learner/list`, 'api.learner.list', data);
  }
}

export const learnerService = LearnerService.getInstance();
