import { baseApiService } from './BaseApiService';
import { User } from '../../models/entities/User';

class AuthService {
  static getInstance(): AuthService {
    return new AuthService();
  }

  async login(data: {
    email: string;
    password: string;
  }): Promise<{ user: User; token: string }> {
    return baseApiService.post(
      '/api/v1/auth/login',
      'api.user.auth.login',
      data,
      {
        extras: { useAuth: false },
      }
    );
  }

  async fetchMe(): Promise<{ user: User }> {
    return baseApiService.get('/api/v1/auth/me');
  }

  async logout() {
    return baseApiService.post('/api/v1/auth/logout', 'api.user.auth.logout');
  }
}

export const authService = AuthService.getInstance();
