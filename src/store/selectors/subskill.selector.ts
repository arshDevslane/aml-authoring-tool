import { createSelector } from 'reselect';
import { AppState } from '../reducers';
import { SubSkillState } from '../reducers/subSkill.reducer';

const subSkillState = (state: AppState) => state.subSkill;

export const getSubSkills = (state: SubSkillState) => {
  const filterKey = JSON.stringify(state.filters);
  const { result: resultIDs, totalCount } = state.cachedData[filterKey] || {
    result: [],
    totalCount: state.latestCount ?? 0,
  };

  return {
    result: resultIDs.map((id) => state.entries[id]).filter(Boolean),
    totalCount,
  };
};

export const subSkillsSelector = createSelector([subSkillState], getSubSkills);

export const isLoadingSubSkillsSelector = createSelector(
  [subSkillState],
  (state: SubSkillState) => state.isLoading
);
