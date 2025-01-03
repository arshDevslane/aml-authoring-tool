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

// repositories
export enum RepositoryActionType {
  GET_LIST = 'repository/getList',
  GET_LIST_COMPLETED = 'repository/getList/completed',
  GET_LIST_ERROR = 'repository/getList/error',
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
