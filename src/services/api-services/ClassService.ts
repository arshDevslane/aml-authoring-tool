import { Class } from '@/models/entities/Class';
import { baseApiService } from './BaseApiService';

class ClassService {
  static getInstance(): ClassService {
    return new ClassService();
  }

  async getList(data: {
    search_query?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    result: {
      classes: Class[];
      meta: {
        offset: number;
        limit: number;
        total: number;
      };
    };
  }> {
    return baseApiService.post(`api/v1/class/list`, 'api.class.list', data);
  }
}

export const classService = ClassService.getInstance();
