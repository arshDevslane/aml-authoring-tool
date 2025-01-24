import { FibType, QuestionType } from '../enums/QuestionType.enum';
import { SkillType } from '../enums/skillType.enum';
import { ArithmaticOperations } from '../enums/ArithmaticOperations.enum';

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
export interface Question {
  identifier: string;
  benchmark_time: string;
  question_type: QuestionType;
  operation: ArithmaticOperations;
  name: Description;
  description: Description;
  question_audio_description: Description;
  tenant: string;
  repository: Repository;
  taxonomy: Taxonomy;
  gradient: string | null;
  hints: string;
  status: string;
  media: any[];
  question_set_ids: string[];
  question_body: QuestionBody;
  sub_skills: Array<SubSkill | null>;
  created_by: string;
  updated_by: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  x_id: string;
}

export interface QuestionBody {
  answers?: Answers;
  numbers: Numbers;
  wrong_answer?: WrongAnswer[];
  options?: string[];
  correct_option?: string;
  question_image?: string;
  question_image_url?: string;
  grid1_pre_fills_top?: string;
  grid1_pre_fills_result?: string;
  grid1_show_carry?: boolean;
  grid1_show_regroup?: boolean;
  grid1_multiply_intermediate_steps_prefills?: string;
  grid1_pre_fills_quotient?: string;
  grid1_pre_fills_remainder?: string;
  grid1_div_intermediate_steps_prefills?: string;
  fib_answer?: string;
}

export interface Answers {
  result: number;
  fib_type: FibType;
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
