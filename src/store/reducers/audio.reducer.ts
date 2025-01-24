import produce from 'immer';
import { AudioActionType } from '../actions/actions.constants';

export type AudioState = {
  isLoading: boolean;
  error?: string;
  entities: Record<string, Record<string, string>>;
};

const initialState: AudioState = {
  isLoading: false,
  entities: {},
};

export const audioReducer = (
  // eslint-disable-next-line @typescript-eslint/default-param-last
  state: AudioState = initialState,
  action: any
) =>
  produce(state, (draft: AudioState) => {
    switch (action.type) {
      case AudioActionType.GET_AUDIO:
        draft.isLoading = true;
        draft.entities = {};
        break;
      case AudioActionType.GET_AUDIO_COMPLETED:
        draft.isLoading = false;
        draft.entities = action.payload.reduce((prev: any, curr: any) => {
          prev[curr.language] = curr;
          return prev;
        }, draft.entities);
        break;
      case AudioActionType.GET_AUDIO_ERROR:
        draft.isLoading = false;
        draft.error = action.payload;
        break;
      case AudioActionType.RESET_STATE:
        draft.isLoading = false;
        draft.entities = {};
        break;
      case AudioActionType.REMOVE_AUDIO_RECORD:
        delete draft.entities[action.payload];
        break;
      default:
        break;
    }
  });
