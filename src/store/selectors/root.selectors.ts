import { createSelector } from 'reselect';
import { AppState } from '../reducers';

export const createEntitiesSelectorFactory = (
  entityStore: Exclude<
    keyof AppState,
    'user' | 'auth' | 'navigationReducer' | 'media' | 'translation' | 'tts'
  >,
  ids: string[]
) =>
  createSelector(
    [(state: AppState) => state[entityStore].entities],
    (entities) => ids.map((id) => entities[id]).filter(Boolean)
  );

export const createEntitySelectorFactory = (
  entityStore: Exclude<
    keyof AppState,
    'user' | 'auth' | 'navigationReducer' | 'media' | 'translation' | 'tts'
  >,
  id: string
) =>
  createSelector(
    [(state: AppState) => state[entityStore].entities],
    (entities) => entities[id]
  );
