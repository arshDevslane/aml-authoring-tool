import { Question } from '@/models/entities/Question';
import { QuestionType } from '@/models/enums/QuestionType.enum';
import { User } from '@/models/entities/User';
import { QuestionSet } from '@/models/entities/QuestionSet';
import { Class } from '@/models/entities/Class';
import { Board } from '@/models/entities/Board';
import { Repository } from '@/models/entities/Repository';
import { Skill } from '@/models/entities/Skill';
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
      classes: Class[];
      boards: Board[];
      repositories: Repository[];
      l1_skills: Skill[];
      l2_skills: Skill[];
      l3_skills: Skill[];
      meta: {
        offset: number;
        limit: number;
        total: number;
      };
      users?: User[];
      question_sets?: QuestionSet[];
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

  async getById(id: string) {
    return baseApiService.get(`/api/v1/question/read/${id}`);
  }

  async createQuestion(data: any) {
    return baseApiService.post(
      `api/v1/question/create`,
      'api.question.create',
      data
    );
  }

  async updateQuestion(data: any) {
    return baseApiService.post(
      `api/v1/question/update/${data.id}`,
      'api.question.update',
      data.question
    );
  }

  async publish(questionId: string) {
    return baseApiService.post(
      `/api/v1/question/publish/${questionId}`,
      'api.question.publish'
    );
  }
}
export const questionsService = QuestionsService.getInstance();
