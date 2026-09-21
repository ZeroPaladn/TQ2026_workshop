import type { APIRequestContext } from '@playwright/test';
import type { GorestPost, GorestPostCreateRequest } from '../types/gorest';

export class GRestPost {
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

  async createPost(userId: number, payload: GorestPostCreateRequest): Promise<GorestPost> {
    return this.send<GorestPost>('POST', `/public/v2/users/${userId}/posts`, payload);
  }

  async getPost(postId: number): Promise<GorestPost> {
    return this.send<GorestPost>('GET', `/public/v2/posts/${postId}`);
  }

  async deletePost(postId: number): Promise<boolean> {
    await this.send<void>('DELETE', `/public/v2/posts/${postId}`);
    return true;
  }
}
