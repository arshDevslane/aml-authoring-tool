import { QuestionSet } from '@/models/entities/QuestionSet';
import { baseApiService } from './BaseApiService';

class QuestionSetService {
  static getInstance(): QuestionSetService {
    return new QuestionSetService();
  }

  async getList(data: {
    filters: {
      title?: string[];
      repository_id?: string;
      board_id?: string;
      class_id?: string;
      l1_skill_id?: string;
      l2_skill_id?: string;
      l3_skill_id?: string;
      sub_skill_id?: string;
    };
    limit?: number;
    offset?: number;
  }): Promise<{
    result: {
      question_sets: QuestionSet[];
      meta: {
        offset: number;
        limit: number;
        total: number;
      };
    };
  }> {
    return baseApiService.post(
      '/api/v1/question-set/search',
      'api.questionSet.search',
      data
    );
  }

  async delete(id: string) {
    return baseApiService.post(
      `/api/v1/question-set/delete/${id}`,
      'api.questionSet.delete',
      { id }
    );
  }

  async getById(id: string) {
    return baseApiService.get(`/api/v1/question-set/read/${id}`);
  }
}

export const questionSetService = QuestionSetService.getInstance();
