import { Description } from './QuestionSet';

export type Repository = {
  created_at: string;
  created_by: string;
  description: Description;
  identifier: string;
  name: Description;
  updated_at: string;
  updated_by: string | null;
  is_active: true;
  status: string;
};
