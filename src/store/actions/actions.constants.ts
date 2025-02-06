// Auth
export enum AuthActionType {
  LOGIN = 'auth/login',
  LOGIN_COMPLETED = 'auth/login/completed',
  LOGIN_ERROR = 'auth/login/error',

  FETCH_ME = 'auth/fetch/me',
  FETCH_ME_COMPLETED = 'auth/fetch/me/completed',
  FETCH_ME_ERROR = 'auth/fetch/me/error',

  LOGOUT = 'store/logout',
}

// questionSet
export enum QuestionSetActionType {
  GET_LIST = 'questionSet/getList',
  GET_LIST_COMPLETED = 'questionSet/getList/completed',
  GET_LIST_ERROR = 'questionSet/getList/error',

  DELETE_QUESTION_SET = 'questionSet/delete',
  DELETE_QUESTION_SET_COMPLETED = 'questionSet/delete/completed',

  GET_QUESTION_SET = 'questionSet/get',
  GET_QUESTION_SET_COMPLETED = 'questionSet/get/completed',
  GET_QUESTION_SET_ERROR = 'questionSet/get/error',

  CREATE_QUESTION_SET = 'questionSet/create',
  CREATE_QUESTION_SET_COMPLETED = 'questionSet/create/completed',

  UPDATE_QUESTION_SET = 'questionSet/update',
  UPDATE_QUESTION_SET_COMPLETED = 'questionSet/update/completed',

  PUBLISH_QUESTION_SET = 'questionSet/publish',
  PUBLISH_QUESTION_SET_COMPLETED = 'questionSet/publish/completed',
}

// questions
export enum QuestionsActionType {
  GET_LIST = 'questions/getList',
  GET_LIST_COMPLETED = 'questions/getList/completed',
  GET_LIST_ERROR = 'questions/getList/error',

  DELETE_QUESTION = 'question/delete',
  DELETE_QUESTION_COMPLETED = 'question/delete/completed',
  DELETE_QUESTION_ERROR = 'question/delete/error',

  GET_QUESTION = 'question/get',
  GET_QUESTION_COMPLETED = 'question/get/completed',
  GET_QUESTION_ERROR = 'question/get/error',

  CREATE_QUESTION = 'create/question',
  CREATE_QUESTION_COMPLETED = 'create/question/completed',
  CREATE_QUESTION_ERROR = 'create/question/error',

  UPDATE_QUESTION = 'update/question',
  UPDATE_QUESTION_COMPLETED = 'update/question/completed',
  UPDATE_QUESTION_ERROR = 'update/question/error',

  PUBLISH_QUESTION = 'question/publish',
  PUBLISH_QUESTION_COMPLETED = 'question/publish/completed',
  PUBLISH_QUESTION_ERROR = 'question/publish/error',
}

// repositories
export enum RepositoryActionType {
  GET_LIST = 'repository/getList',
  GET_LIST_COMPLETED = 'repository/getList/completed',
  GET_LIST_ERROR = 'repository/getList/error',

  GET_BY_ID = 'repository/getById',
  GET_BY_ID_COMPLETED = 'repository/getById/completed',
  GET_BY_ID_ERROR = 'repository/getById/error',

  CREATE_REPOSITORY = 'repository/create',
  CREATE_REPOSITORY_COMPLETED = 'repository/create/completed',
  CREATE_REPOSITORY_ERROR = 'repository/create/error',

  UPDATE_REPOSITORY = 'repository/update',
  UPDATE_REPOSITORY_COMPLETED = 'repository/update/completed',
  UPDATE_REPOSITORY_ERROR = 'repository/update/error',

  DELETE_REPOSITORY = 'repository/delete',
  DELETE_REPOSITORY_COMPLETED = 'repository/delete/completed',
  DELETE_REPOSITORY_ERROR = 'repository/delete/error',

  PUBLISH_REPOSITORY = 'repository/publish',
  PUBLISH_REPOSITORY_COMPLETED = 'repository/publish/completed',
  PUBLISH_REPOSITORY_ERROR = 'repository/publish/error',
}

// boards
export enum BoardActionType {
  GET_LIST = 'board/getList',
  GET_LIST_COMPLETED = 'board/getList/completed',
  GET_LIST_ERROR = 'board/getList/error',
}

// classes
export enum ClassActionType {
  GET_LIST = 'class/getList',
  GET_LIST_COMPLETED = 'class/getList/completed',
  GET_LIST_ERROR = 'class/getList/error',
}

// skills
export enum SkillActionType {
  GET_LIST = 'skill/getList',
  GET_LIST_COMPLETED = 'skill/getList/completed',
  GET_LIST_ERROR = 'skill/getList/error',
}

// subskills
export enum SubskillActionType {
  GET_LIST = 'subskill/getList',
  GET_LIST_COMPLETED = 'subskill/getList/completed',
  GET_LIST_ERROR = 'subskill/getList/error',
}

// contents
export enum ContentActionType {
  GET_LIST = 'content/getList',
  GET_LIST_COMPLETED = 'content/getList/completed',
  GET_LIST_ERROR = 'content/getList/error',

  GET_BY_ID = 'content/getById',
  GET_BY_ID_COMPLETED = 'content/getById/completed',
  GET_BY_ID_ERROR = 'content/getById/error',

  CREATE_CONTENT = 'create/content',
  CREATE_CONTENT_COMPLETED = 'create/content/completed',
  CREATE_CONTENT_ERROR = 'create/content/error',

  UPDATE_CONTENT = 'update/content',
  UPDATE_CONTENT_COMPLETED = 'update/content/completed',
  UPDATE_CONTENT_ERROR = 'update/content/error',

  DELETE_CONTENT = 'content/delete',
  DELETE_CONTENT_COMPLETED = 'content/delete/completed',
  DELETE_CONTENT_ERROR = 'content/delete/error',

  PUBLISH_CONTENT = 'content/publish',
  PUBLISH_CONTENT_COMPLETED = 'content/publish/completed',
  PUBLISH_CONTENT_ERROR = 'content/publish/error',
}

export enum MediaActionType {
  GET_PRESIGNED_URL = 'media/getPresignedUrl',
  GET_PRESIGNED_URL_COMPLETED = 'media/getPresignedUrl/completed',
  GET_PRESIGNED_URL_ERROR = 'media/getPresignedUrl/error',

  UPLOAD = 'media/upload',
  UPLOAD_COMPLETED = 'media/upload/completed',
  UPLOAD_ERROR = 'media/upload/error',

  RESET_STATE = 'media/resetState',
  UPLOAD_PROGRESS = 'UPLOAD_PROGRESS',
}

// translations
export enum TranslationActionType {
  GET_TRANSLATIONS = 'translation/getTranslations',
  GET_TRANSLATIONS_COMPLETED = 'translation/getTranslations/completed',
  GET_TRANSLATIONS_ERROR = 'translation/getTranslations/error',

  RESET_STATE = 'translation/resetState',
  REMOVE_TRANSLATION = 'translation/removeTranslation',
}

// tts
export enum TtsActionType {
  GET_TTS = 'tts/getTts',
  GET_TTS_COMPLETED = 'tts/getTts/completed',
  GET_TTS_ERROR = 'tts/getTts/error',
}

// audio
export enum AudioActionType {
  GET_AUDIO = 'audio/getAudio',
  GET_AUDIO_COMPLETED = 'audio/getAudio/completed',
  GET_AUDIO_ERROR = 'audio/getAudio/error',

  RESET_STATE = 'audio/resetState',
  REMOVE_AUDIO_RECORD = 'audio/removeAudioRecord',
}
