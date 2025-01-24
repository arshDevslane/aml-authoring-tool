import produce from 'immer';
import { AudioActionType } from '../actions/actions.constants';

export type AudioState = {
  isLoading: boolean;
  error?: string;
  entries: Record<string, Record<string, string>>;
};

const initialState: AudioState = {
  isLoading: false,
  entries: {},
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
        draft.entries = {};
        break;
      case AudioActionType.GET_AUDIO_COMPLETED:
        draft.isLoading = false;
        draft.entries = action.payload.reduce((prev: any, curr: any) => {
          prev[curr.language] = curr;
          return prev;
        }, draft.entries);
        break;
      case AudioActionType.GET_AUDIO_ERROR:
        draft.isLoading = false;
        draft.error = action.payload;
        break;
      case AudioActionType.RESET_STATE:
        draft.isLoading = false;
        draft.entries = {};
        break;
      case AudioActionType.REMOVE_AUDIO_RECORD:
        delete draft.entries[action.payload];
        break;
      default:
        break;
    }
  });
