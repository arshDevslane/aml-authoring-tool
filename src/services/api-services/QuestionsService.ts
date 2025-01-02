import { Question } from '@/models/entities/Question';
import { baseApiService } from './BaseApiService';

class QuestionsService {
  static getInstance(): QuestionsService {
    return new QuestionsService();
  }

  async getList(data: {
    filters: {};
    limit?: number;
    offset?: number;
    description?: string;
  }): Promise<{
    result: {
      questions: Question[];
      meta: {
        offset: number;
        limit: number;
        total: number;
      };
    };
  }> {
    return baseApiService.post(
      '/api/v1/question/search',
      'api.question.search',
      data
    );
  }
}
export const questionsService = QuestionsService.getInstance();
