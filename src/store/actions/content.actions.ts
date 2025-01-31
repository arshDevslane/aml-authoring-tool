import { Content } from '@/models/entities/Content';
import { Class } from '@/models/entities/Class';
import { Board } from '@/models/entities/Board';
import { Repository } from '@/models/entities/Repository';
import { Skill } from '@/models/entities/Skill';
import { ContentActionType } from './actions.constants';

export type ContentActionPayloadType = {
  filters: Partial<{
    status: string;
    search_query: string;
    board_id: string;
    class_id: string;
    l1_skill_id: string;
    l2_skill_id: string;
    l3_skill_id: string;
  }> & { page_no: number; sortOrder?: string; orderBy?: string };
};

export type ContentResponseType = {
  contents: Content[];
  totalCount: number;
  classes?: Class[];
  boards?: Board[];
  repositories?: Repository[];
  skills?: Skill[];
  noCache?: boolean;
};

export const getListContentAction = (payload: ContentActionPayloadType) => ({
  type: ContentActionType.GET_LIST,
  payload,
});

export const getListContentCompletedAction = (
  payload: ContentResponseType
) => ({
  type: ContentActionType.GET_LIST_COMPLETED,
  payload,
});

export const getListContentErrorAction = (message: string) => ({
  type: ContentActionType.GET_LIST_ERROR,
  payload: message,
});

export const getContentByIdAction = (id: string) => ({
  type: ContentActionType.GET_BY_ID,
  payload: { id },
});

export const getContentByIdCompletedAction = (payload: any) => ({
  type: ContentActionType.GET_BY_ID_COMPLETED,
  payload,
});

export const getContentByIdErrorAction = (message: string) => ({
  type: ContentActionType.GET_BY_ID_ERROR,
  payload: message,
});

export const createContentAction = (payload: any) => ({
  type: ContentActionType.CREATE_CONTENT,
  payload,
});

export const createContentCompletedAction = (payload: any) => ({
  type: ContentActionType.CREATE_CONTENT_COMPLETED,
  payload,
});

export const createContentErrorAction = (message: string) => ({
  type: ContentActionType.CREATE_CONTENT_ERROR,
  payload: message,
});

export const updateContentAction = (payload: {
  contentId: string;
  data: any;
}) => ({
  type: ContentActionType.UPDATE_CONTENT,
  payload,
});

export const updateContentCompletedAction = (payload: any) => ({
  type: ContentActionType.UPDATE_CONTENT_COMPLETED,
  payload,
});

export const updateContentErrorAction = (message: string) => ({
  type: ContentActionType.UPDATE_CONTENT_ERROR,
  payload: message,
});

export const deleteContentAction = (contentId: string) => ({
  type: ContentActionType.DELETE_CONTENT,
  payload: { contentId },
});

export const deleteContentCompletedAction = () => ({
  type: ContentActionType.DELETE_CONTENT_COMPLETED,
  payload: {},
});

export const deleteContentErrorAction = (message: string) => ({
  type: ContentActionType.DELETE_CONTENT_ERROR,
  payload: message,
});

export const publishContentAction = (contentId: string) => ({
  type: ContentActionType.PUBLISH_CONTENT,
  payload: { contentId },
});

export const publishContentCompletedAction = (payload: any) => ({
  type: ContentActionType.PUBLISH_CONTENT_COMPLETED,
  payload,
});

export const publishContentErrorAction = (message: string) => ({
  type: ContentActionType.PUBLISH_CONTENT_ERROR,
  payload: message,
});
