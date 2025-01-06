import { Subskill } from '@/models/entities/Subskill';
import { baseApiService } from './BaseApiService';

class SubskillService {
  static getInstance(): SubskillService {
    return new SubskillService();
  }

  async getList(data: {
    search_query?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    result: {
      sub_skills: Subskill[];
      meta: {
        offset: number;
        limit: number;
        total: number;
      };
    };
  }> {
    return baseApiService.post(
      'api/v1/sub-skill/list',
      'api.subskill.list',
      data
    );
  }
}
export const subskillService = SubskillService.getInstance();
