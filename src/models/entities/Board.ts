import { Description } from './QuestionSet';

export type Board = {
  identifier: string;
  name: Description;
  supported_lang: Description;
  class_ids: ClassIds[];
  skill_taxonomy_id: string | null;
  description: Description;
  status: string;
  is_active: boolean;
  created_by: string;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ClassIds = {
  identifier: string;
  sequence_no: number;
  l1_skill_ids: string[];
};
