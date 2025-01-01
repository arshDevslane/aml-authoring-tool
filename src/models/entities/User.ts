import { Entity } from '../entity';

export interface User extends Entity {
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  identifier: string;
  tenant_id: string;
  is_active: boolean;
  created_by: string;
  updated_by: string;
}
