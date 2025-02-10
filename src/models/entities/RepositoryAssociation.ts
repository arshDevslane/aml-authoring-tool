export type RepositoryAssociation = {
  board_id: string;
  id: number;
  learner_id: string;
  tenant_id: string;
  created_at: string;
  created_by: string;
  identifier: string;
  updated_at: string;
  updated_by: string | null;
  is_active: boolean;
  repository_id: string;
  sequence: number;
  deleted_at: string | null;
};
