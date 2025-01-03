import { SagaPayloadType } from '@/types/SagaPayload.type';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { PaginationLimit } from '@/enums/tableEnums';
import { skillService } from '@/services/api-services/SkillService';
import {
  getListSkillCompletedAction,
  getListSkillErrorAction,
  SkillActionPayloadType,
} from '../actions/skill.action';
import { AppState } from '../reducers';
import { SkillActionType } from '../actions/actions.constants';

interface SkillSagaPayloadType extends SagaPayloadType {
  payload: SkillActionPayloadType;
}

function* getListSkillSaga(data: SkillSagaPayloadType): any {
  try {
    const { page_no: pageNo = 1, ...filters } = data.payload.filters;
    const cachedData: AppState['skill']['cachedData'][string] = yield select(
      (state: AppState) =>
        state.skill.cachedData[JSON.stringify(data.payload.filters)]
    );

    if (cachedData?.result) {
      const entries: AppState['skill']['entries'] = yield select(
        (state: AppState) => state.skill.entries
      );
      yield put(
        getListSkillCompletedAction({
          skills: cachedData.result.map((id) => entries[id]).filter(Boolean),
          totalCount: cachedData.totalCount,
        })
      );
      return;
    }

    const response: Awaited<ReturnType<typeof skillService.getList>> =
      yield call(skillService.getList, {
        ...filters,
        limit: PaginationLimit.PAGE_SIZE,
        offset: (pageNo - 1) * PaginationLimit.PAGE_SIZE,
      });
    yield put(
      getListSkillCompletedAction({
        skills: response.result.skills,
        totalCount: response.result.meta.total,
      })
    );
  } catch (e: any) {
    yield put(
      getListSkillErrorAction((e?.errors && e.errors[0]?.message) || e?.message)
    );
  }
}

export function* skillSaga() {
  yield all([takeLatest(SkillActionType.GET_LIST, getListSkillSaga)]);
}
