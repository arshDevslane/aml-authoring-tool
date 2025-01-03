import { Description } from './QuestionSet';

export type Class = {
  identifier: string;
  name: Description;
  prerequisites: string[] | null;
  description: Description;
  status: string;
  is_active: boolean;
  created_by: string;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};
