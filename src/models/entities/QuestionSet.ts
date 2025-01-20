import { SkillType } from '@/models/enums/skillType.enum';
import { Question } from './Question';

export interface QuestionSet {
  identifier: string;
  title: Description;
  description: Description;
  repository: Repository;
  questions: Question[];
  sequence: number;
  tenant: string;
  taxonomy: Taxonomy;
  sub_skills: SubSkill[];
  purpose: string;
  enable_feedback: boolean;
  is_atomic: boolean;
  gradient: string;
  group_name: number | null;
  content_ids: string[] | null;
  contents: string[];
  instruction_text: string;
  status: string;
  is_active: boolean;
  created_by: string;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  x_id: string;
}

export interface Description {
  en: string;
  kn?: string;
  hi?: string;
}

export interface Repository {
  identifier: string;
  name: Description;
}

export interface SubSkill {
  identifier: string;
  name: Name;
}

export interface Name {
  en: string;
  hi?: string;
  kn?: string;
}

export interface Taxonomy {
  board: SubSkill;
  class: SubSkill;
  l1_skill: Skill;
  l2_skill: Skill[];
  l3_skill: Skill[];
}

export interface Skill {
  identifier: string;
  name: Name;
  type: SkillType;
}
