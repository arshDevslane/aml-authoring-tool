import { createSelector } from 'reselect';
import { SkillType } from '@/models/enums/skillType.enum';
import { AppState } from '../reducers';
import { SkillState } from '../reducers/skill.reducer';

const skillState = (state: AppState) => state.skill;

const getSkills = (state: SkillState, filters = {}) => {
  const filterKey = JSON.stringify({ ...state.filters, ...filters });
  const { result: resultIDs, totalCount } = state.cachedData[filterKey] || {
    result: [],
    totalCount: state.latestCount ?? 0,
  };

  return {
    result: resultIDs?.map((id) => state.entities[id]).filter(Boolean),
    totalCount,
  };
};

export const skillsSelector = createSelector([skillState], getSkills);

export const isLoadingSkillsSelector = createSelector(
  [skillState],
  (state: SkillState) => state.isLoading
);

export const l1SkillSelector = createSelector(
  [skillState],
  (state: SkillState) => getSkills(state, { skill_type: SkillType.L1Skill })
);

export const l2SkillSelector = createSelector(
  [skillState],
  (state: SkillState) => getSkills(state, { skill_type: SkillType.L2Skill })
);

export const l3SkillSelector = createSelector(
  [skillState],
  (state: SkillState) => getSkills(state, { skill_type: SkillType.L3Skill })
);
