import { Skill } from '@/models/entities/Skill';
import { baseApiService } from './BaseApiService';

class SkillService {
  static getInstance(): SkillService {
    return new SkillService();
  }

  async getList(data: {
    searchQuery?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    result: {
      skills: Skill[];
      meta: {
        offset: number;
        limit: number;
        total: number;
      };
    };
  }> {
    return baseApiService.post(`api/v1/skill/list`, 'api.skill.list', data);
  }
}

export const skillService = SkillService.getInstance();
