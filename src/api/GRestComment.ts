import type { APIRequestContext } from '@playwright/test';
import type { GorestComment, GorestCommentCreateRequest } from '../types/gorest';

export class GRestComment {
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

  async createComment(postId: number, payload: GorestCommentCreateRequest): Promise<GorestComment> {
    return this.send<GorestComment>('POST', `/public/v2/posts/${postId}/comments`, payload);
  }

  async getComments(postId: number): Promise<GorestComment[]> {
    return this.send<GorestComment[]>('GET', `/public/v2/posts/${postId}/comments`);
  }

  async getComment(commentId: number): Promise<GorestComment> {
    return this.send<GorestComment>('GET', `/public/v2/comments/${commentId}`);
  }
}
