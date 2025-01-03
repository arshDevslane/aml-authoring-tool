import { QuestionType } from '../enums/QuestionType.enum';
import { SkillType } from '../enums/skillType.enum';

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
}
export interface Description {
  en: string;
  kn?: string;
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
  l3_skill: null[];
}
export interface Skill {
  identifier: string;
  name: Name;
  type: SkillType;
}
export interface Question {
  identifier: string;
  benchmark_time: number;
  question_type: QuestionType;
  operation: string;
  name: Description;
  description: Description;
  tenant: string;
  repository: Repository;
  taxonomy: Taxonomy;
  gradient: string | null;
  hints: string;
  status: string;
  media: any[];
  question_body: QuestionBody;
  sub_skills: Array<SubSkill | null>;
  created_by: string;
  updated_by: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuestionBody {
  answers?: Answers;
  numbers: Numbers;
  wrong_answer?: WrongAnswer[];
  options?: string[];
  correct_option?: string;
  question_image?: string;
}

export interface Answers {
  result: number;
  fib_type: string;
}
export interface Numbers {
  n1: string | null;
  n2: string | null;
}
interface WrongAnswer {
  value: number[];
  subskillname: Subskillname;
}
enum Subskillname {
  Carry = 'carry',
  XPlus0 = 'x_plus_0',
}
