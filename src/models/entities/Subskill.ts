import { Description } from './QuestionSet';

export type Subskill = {
  id: number;
  identifier: string;
  name: Description;
  description: Description;
  status: string;
  is_active: boolean;
  created_by: string;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};
