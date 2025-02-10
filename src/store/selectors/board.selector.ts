import { createSelector } from 'reselect';
import { AppState } from '../reducers';
import { BoardState } from '../reducers/board.reducer';

const boardState = (state: AppState) => state.board;

export const boardSelector = createSelector(
  [boardState],
  (state: BoardState) => {
    const filterKey = JSON.stringify(state.filters);
    const { result: resultIDs, totalCount } = state.cachedData[filterKey] || {
      result: [],
      totalCount: state.latestCount ?? 0,
    };

    return {
      result: resultIDs?.map((id) => state.entities[id]).filter(Boolean),
      totalCount,
    };
  }
);

export const isLoadingBoardsSelector = createSelector(
  [boardState],
  (state: BoardState) => state.isLoading
);

export const boardEntitiesSelector = createSelector(
  [boardState],
  (state: BoardState) => state.entities
);

export const getAllBoardsSelector = (ids: string[]) =>
  createSelector([boardState], (state: BoardState) => {
    const result: BoardState['entities'][string][] = [];
    ids.forEach((id) => {
      const data = state.entities[id] as BoardState['entities'][string];
      if (data) {
        result.push(data);
      }
    });
    return result;
  });
