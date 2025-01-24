import produce from 'immer';
import { TtsActionType } from '../actions/actions.constants';

export type TtsState = {
  isLoading: boolean;
  error?: string;
  tts?: {
    identifier: string;
    description_hash: string;
    language: string;
    audio_url: string;
  };
};

const initialState: TtsState = {
  isLoading: false,
};

export const ttsReducer = (
  // eslint-disable-next-line @typescript-eslint/default-param-last
  state: TtsState = initialState,
  action: any
) =>
  produce(state, (draft: TtsState) => {
    switch (action.type) {
      case TtsActionType.GET_TTS:
        draft.isLoading = true;
        break;
      case TtsActionType.GET_TTS_COMPLETED:
        draft.isLoading = false;
        draft.tts = action.payload;
        break;
      case TtsActionType.GET_TTS_ERROR:
        draft.isLoading = false;
        draft.error = action.payload;
        break;
      default:
        break;
    }
  });
