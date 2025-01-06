import { Board } from '@/models/entities/Board';
import { baseApiService } from './BaseApiService';

class BoardService {
  static getInstance(): BoardService {
    return new BoardService();
  }

  async getList(data: {
    search_query?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    result: {
      boards: Board[];
      meta: {
        offset: number;
        limit: number;
        total: number;
      };
    };
  }> {
    return baseApiService.post(`api/v1/board/list`, 'api.board.list', data);
  }
}

export const boardService = BoardService.getInstance();
