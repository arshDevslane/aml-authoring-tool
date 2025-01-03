import { Question } from '@/models/entities/Question';
import { QuestionType } from '@/models/enums/QuestionType.enum';
import { baseApiService } from './BaseApiService';

class QuestionsService {
  static getInstance(): QuestionsService {
    return new QuestionsService();
  }

  async getList(data: {
    filters: {
      question_type?: Array<QuestionType>;
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

  async delete(id: string) {
    return baseApiService.post(
      `/api/v1/question/delete/${id}`,
      'api.question.delete',
      { id }
    );
  }
}
export const questionsService = QuestionsService.getInstance();
