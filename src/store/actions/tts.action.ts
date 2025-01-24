import { TtsActionType } from './actions.constants';

export type TtsActionPayloadType = {
  input_string: string;
  target_language: string;
};

export const getTtsAction = (payload: TtsActionPayloadType) => ({
  type: TtsActionType.GET_TTS,
  payload,
});

export const getTtsCompletedAction = (payload: any) => ({
  type: TtsActionType.GET_TTS_COMPLETED,
  payload,
});

export const getTtsErrorAction = (payload: any) => ({
  type: TtsActionType.GET_TTS_ERROR,
  payload,
});
