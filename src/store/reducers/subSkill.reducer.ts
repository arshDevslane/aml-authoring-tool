/* eslint-disable no-case-declarations */
import { CacheAPIResponse } from '@/lib/utils';
import { Subskill } from '@/models/entities/Subskill';
import produce from 'immer';
import { SubskillActionPayloadType } from '../actions/subSkill.action';
import { SubskillActionType } from '../actions/actions.constants';

export type SubSkillState = SubskillActionPayloadType & {
  cachedData: CacheAPIResponse;
  entries: Record<string, Subskill>;
  isLoading: boolean;
  latestCount: number;
  error?: string;
};

const initialState: SubSkillState = {
  isLoading: false,
  filters: {
    searchQuery: '',
    page_no: 1,
  },
  latestCount: 0,
  cachedData: {},
  entries: {},
};

export const subSkillReducer = (
  // eslint-disable-next-line @typescript-eslint/default-param-last
  state: SubSkillState = initialState,
  action: any
) =>
  produce(state, (draft: SubSkillState) => {
    switch (action.type) {
      case SubskillActionType.GET_LIST:
        draft.isLoading = true;
        draft.filters = action.payload.filters;
        break;
      case SubskillActionType.GET_LIST_COMPLETED:
        draft.isLoading = false;

        const filterKey = JSON.stringify(state.filters);
        const subSkillMap = action.payload.subSkills.reduce(
          (acc: any, subSkill: Subskill) => ({
            ...acc,
            [subSkill.identifier]: subSkill,
          }),
          {} as Record<string, Subskill>
        );

        draft.entries = { ...state.entries, ...subSkillMap };
        draft.cachedData[filterKey] = {
          result: action.payload.subSkills.map(
            (subSkill: Subskill) => subSkill.identifier
          ),
          totalCount: action.payload.totalCount,
        };
        draft.latestCount = action.payload.totalCount;
        break;
      case SubskillActionType.GET_LIST_ERROR:
        draft.isLoading = false;
        draft.error = action.payload;
        break;
      default:
        break;
    }
  });
