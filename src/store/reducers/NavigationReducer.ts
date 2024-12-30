/* eslint-disable  @typescript-eslint/default-param-last */

import { NAVIGATE_TO } from '@/store/actions/navigation.action';

export interface NavigationState {
  path: string;
}

const initialState = {
  path: '',
};

export const navigationReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case NAVIGATE_TO:
      return {
        ...state,
        path: action.payload,
      };
    case 'CLEAR_NAVIGATION_PATH':
      return {
        ...state,
        path: '',
      };
    default:
      return state;
  }
};
