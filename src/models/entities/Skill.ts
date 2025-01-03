import { Description } from './QuestionSet';

export type Skill = {
  id: number;
  identifier: string;
  name: Description;
  description: Description;
  type: string;
  is_active: boolean;
  status: string;
  created_by: string;
  updated_by: string | null;
  updated_at: string;
  created_at: string;
};
