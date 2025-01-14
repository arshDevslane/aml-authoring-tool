/* eslint-disable no-case-declarations */
import produce from 'immer';
import { CacheAPIResponse } from '@/lib/utils';
import { Board } from '@/models/entities/Board';
import { BoardActionType } from '../actions/actions.constants';
import { BoardActionPayloadType } from '../actions/board.action';

export type BoardState = BoardActionPayloadType & {
  cachedData: CacheAPIResponse;
  entities: Record<string, Board>;
  isLoading: boolean;
  latestCount: number;
  error?: string;
};

const initialState: BoardState = {
  isLoading: false,
  filters: {
    search_query: '',
    page_no: 1,
  },
  latestCount: 0,
  cachedData: {},
  entities: {},
};

export const boardReducer = (
  // eslint-disable-next-line @typescript-eslint/default-param-last
  state: BoardState = initialState,
  action: any
) =>
  produce(state, (draft: BoardState) => {
    switch (action.type) {
      case BoardActionType.GET_LIST:
        draft.isLoading = true;
        draft.filters = action.payload.filters;
        break;
      case BoardActionType.GET_LIST_COMPLETED:
        draft.isLoading = false;

        const filterKey = JSON.stringify(state.filters);
        const boardMap = action.payload.boards.reduce(
          (acc: any, board: Board) => ({
            ...acc,
            [board.identifier]: board,
          }),
          {} as Record<string, Board>
        );

        draft.entities = { ...state.entities, ...boardMap };
        if (!action.payload.noCache) {
          draft.cachedData[filterKey] = {
            result: action.payload.boards.map(
              (board: Board) => board.identifier
            ),
            totalCount: action.payload.totalCount,
          };
        }
        draft.latestCount = action.payload.totalCount;
        break;
      case BoardActionType.GET_LIST_ERROR:
        draft.isLoading = false;
        draft.error = action.payload;
        break;
      default:
        break;
    }
  });
