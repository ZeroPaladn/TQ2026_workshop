import type { APIRequestContext } from '@playwright/test';
import type {
  GorestUser,
  GorestUserCreateRequest,
  GorestUserUpdateRequest,
} from '../types/gorest';

export class GRestUser {
  private readonly baseUrl = 'https://gorest.co.in';

  constructor(
    private readonly request: APIRequestContext,
    private readonly apiToken?: string,
  ) {}

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    if (this.apiToken) {
      headers.Authorization = `Bearer ${this.apiToken}`;
    }

    return headers;
  }

  private async send<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    path: string,
    body?: unknown,
  ): Promise<T> {
    const response = await this.request.fetch(`${this.baseUrl}${path}`, {
      method,
      headers: this.getHeaders(),
      data: body,
    });

    if (!response.ok()) {
      const details = await response.text();
      throw new Error(`Gorest ${method} ${path} failed with ${response.status()}: ${details}`);
    }

    if (response.status() === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  }

  async listUsers(): Promise<GorestUser[]> {
    return this.send<GorestUser[]>('GET', '/public/v2/users');
  }

  async createUser(payload: GorestUserCreateRequest): Promise<GorestUser> {
    return this.send<GorestUser>('POST', '/public/v2/users', payload);
  }

  async getUser(userId: number): Promise<GorestUser> {
    return this.send<GorestUser>('GET', `/public/v2/users/${userId}`);
  }

  async updateUser(userId: number, payload: GorestUserUpdateRequest): Promise<GorestUser> {
    return this.send<GorestUser>('PUT', `/public/v2/users/${userId}`, payload);
  }

  async deleteUser(userId: number): Promise<boolean> {
    await this.send<void>('DELETE', `/public/v2/users/${userId}`);
    return true;
  }
}
