import { SagaPayloadType } from '@/types/SagaPayload.type';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { boardService } from '@/services/api-services/BoardService';
import { PaginationLimit } from '@/enums/tableEnums';
import {
  BoardActionPayloadType,
  getListBoardCompletedAction,
  getListBoardErrorAction,
} from '../actions/board.action';
import { AppState } from '../reducers';
import { BoardActionType } from '../actions/actions.constants';

interface BoardSagaPayloadType extends SagaPayloadType {
  payload: BoardActionPayloadType;
}

function* getListBoardSaga(data: BoardSagaPayloadType): any {
  try {
    const { page_no: pageNo = 1, ...filters } = data.payload.filters;
    const cachedData: AppState['board']['cachedData'][string] = yield select(
      (state: AppState) =>
        state.board.cachedData[JSON.stringify(data.payload.filters)]
    );

    if (cachedData?.result) {
      const entities: AppState['board']['entities'] = yield select(
        (state: AppState) => state.board.entities
      );
      yield put(
        getListBoardCompletedAction({
          boards: cachedData.result.map((id) => entities[id]).filter(Boolean),
          totalCount: cachedData.totalCount,
        })
      );
      return;
    }

    const response: Awaited<ReturnType<typeof boardService.getList>> =
      yield call(boardService.getList, {
        ...filters,
        limit: PaginationLimit.PAGE_SIZE,
        offset: (pageNo - 1) * PaginationLimit.PAGE_SIZE,
      });
    yield put(
      getListBoardCompletedAction({
        boards: response.result.boards,
        totalCount: response.result.meta.total,
      })
    );
  } catch (e: any) {
    yield put(
      getListBoardErrorAction((e?.errors && e.errors[0]?.message) || e?.message)
    );
  }
}

export function* boardSaga() {
  yield all([takeLatest(BoardActionType.GET_LIST, getListBoardSaga)]);
}
