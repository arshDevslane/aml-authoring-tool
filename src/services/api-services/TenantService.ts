import { Tenants } from '@/models/entities/Tenants';
import { baseApiService } from './BaseApiService';

class TenantService {
  static getInstance(): TenantService {
    return new TenantService();
  }

  async getList(data: { limit?: number; offset?: number }): Promise<{
    result: Tenants[];
  }> {
    return baseApiService.post(
      `api/v1/tenant/search`,
      'api.tenant.search',
      data
    );
  }
}

export const tenantService = TenantService.getInstance();
