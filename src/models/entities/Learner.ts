export interface Learner {
  id: number;
  identifier: string;
  username: string;
  password: string;
  name: string;
  taxonomy: {
    board: { identifier: string };
    class: { identifier: string };
  };
  tenant_id: string;
  board_id: string;
  school_id: string | null;
  class_id: string;
  section_id: string | null;
  created_by: string;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}
