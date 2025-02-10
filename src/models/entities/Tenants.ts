import { Description } from './Question';

export type Tenants = {
  identifier: string;
  name: Description;
  type: Description;
  board_id: number[];
  is_active: boolean;
  enable_telemetry: boolean;
  status: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
};
