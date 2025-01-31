import { SagaPayloadType } from '@/types/SagaPayload.type';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { contentService } from '@/services/api-services/ContentService';
import { PaginationLimit } from '@/enums/tableEnums';
import { toastService } from '@/services/ToastService';
import { ContentCreateUpdatePayload } from '@/components/QuestionSetContentUploadForm/QuestionSetContentUploadForm';
import {
  ContentActionPayloadType,
  createContentCompletedAction,
  createContentErrorAction,
  deleteContentCompletedAction,
  deleteContentErrorAction,
  getContentByIdCompletedAction,
  getContentByIdErrorAction,
  getListContentAction,
  getListContentCompletedAction,
  getListContentErrorAction,
  publishContentCompletedAction,
  publishContentErrorAction,
  updateContentCompletedAction,
  updateContentErrorAction,
} from '../actions/content.actions';
import { ContentActionType } from '../actions/actions.constants';
import { AppState } from '../reducers';

interface ContentSagaPayloadType extends SagaPayloadType {
  payload: ContentActionPayloadType;
}

interface CreateContentPayloadType extends SagaPayloadType {
  payload: ContentCreateUpdatePayload;
}
interface UpdateContentPayloadType extends SagaPayloadType {
  payload: {
    contentId: string;
    data: Partial<ContentCreateUpdatePayload>;
  };
}

interface DeleteContentSagaPayloadType extends SagaPayloadType {
  payload: { contentId: string };
}

function* getListContentSaga(data: ContentSagaPayloadType): any {
  try {
    const {
      page_no: pageNo = 1,
      sortOrder,
      orderBy,
      ...filters
    } = data.payload.filters;
    const cachedData: AppState['content']['cachedData'][string] = yield select(
      (state: AppState) =>
        state.content.cachedData[JSON.stringify(data.payload.filters)]
    );

    if (cachedData?.result) {
      const entities: AppState['content']['entities'] = yield select(
        (state: AppState) => state.content.entities
      );
      yield put(
        getListContentCompletedAction({
          contents: cachedData.result.map((id) => entities[id]).filter(Boolean),
          totalCount: cachedData.totalCount,
        })
      );
      return;
    }

    const response: Awaited<ReturnType<typeof contentService.getList>> =
      yield call(contentService.getList, {
        filters,
        ...(orderBy && sortOrder && { sort_by: [[orderBy, sortOrder]] }),
        limit: PaginationLimit.PAGE_SIZE,
        offset: (pageNo - 1) * PaginationLimit.PAGE_SIZE,
      });
    yield put(
      getListContentCompletedAction({
        contents: response.result.contents,
        totalCount: response.result.meta.total,
        boards: response.result.boards,
        noCache: true,
        classes: response.result.classes,
        repositories: response.result.repositories,
        skills: [
          ...response.result.l1_skills,
          ...response.result.l2_skills,
          ...response.result.l3_skills,
        ],
      })
    );
  } catch (e: any) {
    const errorMessage = e?.response?.data?.error?.message;
    toastService.showError(errorMessage);
    yield put(getListContentErrorAction(errorMessage));
  }
}

function* getContentByIdSaga(data: any): any {
  try {
    const { id } = data.payload;
    const response: Awaited<ReturnType<typeof contentService.getById>> =
      yield call(contentService.getById, id);
    yield put(getContentByIdCompletedAction(response));
  } catch (e: any) {
    const errorMessage = e?.response?.data?.error?.message;
    toastService.showError(errorMessage);
    yield put(getContentByIdErrorAction(errorMessage));
  }
}

function* createContentSaga(data: CreateContentPayloadType): any {
  try {
    const filters: ContentActionPayloadType['filters'] = yield select(
      (state: AppState) => state.content.filters
    );
    const response = yield call(contentService.create, data.payload);
    yield put(createContentCompletedAction(response));
    toastService.showSuccess('Content created successfully');
    yield put(getListContentAction({ filters }));
  } catch (e: any) {
    const errorMessage = e?.response?.data?.error?.message;
    yield put(createContentErrorAction(errorMessage));
    toastService.showError(errorMessage);
  }
}

function* updateContentSaga(data: UpdateContentPayloadType): any {
  try {
    const response = yield call(contentService.update, data.payload);
    yield put(updateContentCompletedAction(response.result));

    toastService.showSuccess('Content updated successfully');
  } catch (e: any) {
    const errorMessage = e?.response?.data?.error?.message;
    yield put(updateContentErrorAction(errorMessage));
    toastService.showError(errorMessage);
  }
}

function* deleteContentSaga(data: DeleteContentSagaPayloadType): any {
  const { contentId } = data.payload;
  try {
    const filters: ContentActionPayloadType['filters'] = yield select(
      (state: AppState) => state.content.filters
    );

    yield call(contentService.delete, contentId);
    yield put(deleteContentCompletedAction());
    toastService.showSuccess(' Content deleted successfully');
    yield put(
      getListContentAction({
        filters,
      })
    );
  } catch (e: any) {
    const errorMessage = e?.response?.data?.error?.message;
    toastService.showError(errorMessage);
    yield put(deleteContentErrorAction(errorMessage));
  }
}

function* publishContentSaga(data: DeleteContentSagaPayloadType): any {
  try {
    const response = yield call(
      contentService.publish,
      data.payload?.contentId
    );
    yield put(
      publishContentCompletedAction({
        content: response.result.content,
      })
    );

    toastService.showSuccess('Content published successfully');
  } catch (e: any) {
    const errorMessage = e?.response?.data?.error?.message;
    yield put(publishContentErrorAction(errorMessage));
    toastService.showError(errorMessage);
  }
}

export function* contentSaga() {
  yield all([
    takeLatest(ContentActionType.GET_LIST, getListContentSaga),
    takeLatest(ContentActionType.GET_BY_ID, getContentByIdSaga),
    takeLatest(ContentActionType.CREATE_CONTENT, createContentSaga),
    takeLatest(ContentActionType.UPDATE_CONTENT, updateContentSaga),
    takeLatest(ContentActionType.DELETE_CONTENT, deleteContentSaga),
    takeLatest(ContentActionType.PUBLISH_CONTENT, publishContentSaga),
  ]);
}
