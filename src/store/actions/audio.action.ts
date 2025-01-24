import { AudioActionType } from './actions.constants';

export const getAudioListAction = (payload: { questionId: string }) => ({
  type: AudioActionType.GET_AUDIO,
  payload,
});

export const getAudioListCompletedAction = (payload: any) => ({
  type: AudioActionType.GET_AUDIO_COMPLETED,
  payload,
});

export const getAudioListErrorAction = (message: string) => ({
  type: AudioActionType.GET_AUDIO_ERROR,
  payload: message,
});

export const resetAudioStateAction = () => ({
  type: AudioActionType.RESET_STATE,
});

export const removeAudioRecordAction = (lang: string) => ({
  type: AudioActionType.REMOVE_AUDIO_RECORD,
  payload: lang,
});
