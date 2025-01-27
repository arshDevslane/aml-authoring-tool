import { ContentCreateUpdatePayload } from '@/components/QuestionSetContentUploadForm/QuestionSetContentUploadForm';
import { Content } from '@/models/entities/Content';
import { baseApiService } from './BaseApiService';

class ContentService {
  static getInstance(): ContentService {
    return new ContentService();
  }

  async getList(data: {
    filters: {
      search_query?: string;
      status?: string;
      board_id?: string;
      class_id?: string;
      repository_id?: string;
      l1_skill_id?: string;
      l2_skill_id?: string;
      l3_skill_id?: string;
    };
    limit?: number;
    offset?: number;
  }): Promise<{
    result: {
      contents: Content[];
      meta: {
        offset: number;
        limit: number;
        total: number;
      };
    };
  }> {
    return baseApiService.post(
      '/api/v1/content/search',
      'api.content.search',
      data
    );
  }

  async getById(id: string) {
    return baseApiService.get(`/api/v1/content/read/${id}`);
  }

  async create(content: ContentCreateUpdatePayload) {
    return baseApiService.post(
      '/api/v1/content/create',
      'api.content.create',
      content
    );
  }

  async update({
    contentId,
    data,
  }: {
    contentId: string;
    data: Partial<ContentCreateUpdatePayload>;
  }) {
    return baseApiService.post(
      `/api/v1/content/update/${contentId}`,
      'api.content.update',
      data
    );
  }

  async delete(id: string) {
    return baseApiService.post(
      `/api/v1/content/delete/${id}`,
      'api.content.delete',
      { id }
    );
  }
}

export const contentService = ContentService.getInstance();
