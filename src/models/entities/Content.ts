import { Description, SubSkill, Taxonomy, Repository } from './Question';

export type Content = {
  identifier: string;
  name: Description;
  description: Description;
  tenant: string;
  repository: Repository;
  taxonomy: Taxonomy;
  sub_skills: SubSkill[];
  gradient: string | null;
  status: string;
  media: Media[];
  created_by: string;
  updated_by: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  x_id: string;
};

export type Media = {
  src: string;
  fileName: string;
  mediaType: string;
  mimeType: string;
  url: string;
};
