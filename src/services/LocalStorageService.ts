import { decodeToken } from 'react-jwt';
import { DecodedToken } from '@/types/interfaces';

export const AUTH_TOKEN = 'auth_token';
export const PREV_LINK = 'prev_link';

export class LocalStorageService {
  private static _instance: LocalStorageService;

  static getInstance(): LocalStorageService {
    if (!this._instance) {
      this._instance = new LocalStorageService();
    }

    return this._instance;
  }

  setLocalStorageValue(key: string, value: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage?.setItem(key, value);
    }
  }

  getLocalStorageValue(key: string): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage?.getItem(key);
    }
    return null;
  }

  removeLocalStorageValue(key: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage?.removeItem(key);
    }
  }

  setSessionStorageValue(key: string, value: string): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage?.setItem(key, value);
    }
  }

  getSessionStorageValue(key: string): string | null {
    if (typeof sessionStorage !== 'undefined') {
      return sessionStorage?.getItem(key);
    }
    return null;
  }

  removeSessionStorageValue(key: string): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage?.removeItem(key);
    }
  }

  setAuthToken(token: string): void {
    this.setLocalStorageValue(AUTH_TOKEN, token);
  }

  getAuthToken(): string | null {
    return this.getLocalStorageValue(AUTH_TOKEN);
  }

  removeAuthToken(): void {
    this.removeLocalStorageValue(AUTH_TOKEN);
  }

  getTokenExpiry() {
    const userToken = localStorage?.getItem(AUTH_TOKEN);
    if (userToken) {
      const decodedToken: DecodedToken = decodeToken(userToken)!;
      if (decodedToken && decodedToken.exp) {
        const expirationTimestamp = decodedToken.exp;

        return new Date(expirationTimestamp * 1000);
      }
    }
    return null;
  }
}

export const localStorageService = LocalStorageService.getInstance();
