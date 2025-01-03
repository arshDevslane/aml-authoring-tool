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
}

// questions
export enum QuestionsActionType {
  GET_LIST = 'questions/getList',
  GET_LIST_COMPLETED = 'questions/getList/completed',
  GET_LIST_ERROR = 'questions/getList/error',

  DELETE_QUESTION = 'question/delete',
  DELETE_QUESTION_COMPLETED = 'question/delete/completed',
}
