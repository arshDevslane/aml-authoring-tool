// actions.ts
export const NAVIGATE_TO = 'NAVIGATE_TO';

export const navigateTo = (path: string) => ({
  type: NAVIGATE_TO,
  payload: path,
});
