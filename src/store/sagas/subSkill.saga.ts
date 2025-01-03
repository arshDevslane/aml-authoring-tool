import { SagaPayloadType } from '@/types/SagaPayload.type';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { subskillService } from '@/services/api-services/SubskillService';
import { PaginationLimit } from '@/enums/tableEnums';
import {
  getListSubSkillCompletedAction,
  getListSubSkillErrorAction,
  SubskillActionPayloadType,
} from '../actions/subSkill.action';
import { AppState } from '../reducers';
import { SubskillActionType } from '../actions/actions.constants';

interface SubskillSagaPayload extends SagaPayloadType {
  payload: SubskillActionPayloadType;
}

function* getListSubSkillSaga(data: SubskillSagaPayload): any {
  try {
    const { page_no: pageNo = 1, ...filters } = data.payload.filters;
    const cachedData: AppState['subSkill']['cachedData'][string] = yield select(
      (state: AppState) =>
        state.subSkill.cachedData[JSON.stringify(data.payload.filters)]
    );

    if (cachedData?.result) {
      const entries: AppState['subSkill']['entries'] = yield select(
        (state: AppState) => state.subSkill.entries
      );
      yield put(
        getListSubSkillCompletedAction({
          subSkills: cachedData.result.map((id) => entries[id]).filter(Boolean),
          totalCount: cachedData.totalCount,
        })
      );
      return;
    }

    const response: Awaited<ReturnType<typeof subskillService.getList>> =
      yield call(subskillService.getList, {
        ...filters,
        limit: PaginationLimit.PAGE_SIZE,
        offset: (pageNo - 1) * PaginationLimit.PAGE_SIZE,
      });
    yield put(
      getListSubSkillCompletedAction({
        subSkills: response.result.sub_skills,
        totalCount: response.result.meta.total,
      })
    );
  } catch (e: any) {
    yield put(
      getListSubSkillErrorAction(
        (e?.errors && e.errors[0]?.message) || e?.message
      )
    );
  }
}

export function* subSkillSaga() {
  yield all([takeLatest(SubskillActionType.GET_LIST, getListSubSkillSaga)]);
}
