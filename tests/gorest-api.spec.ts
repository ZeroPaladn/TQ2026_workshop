import { expect, test } from '@playwright/test';
import { GRestComment } from '../src/api/GRestComment';
import { GRestPost } from '../src/api/GRestPost';
import { GRestUser } from '../src/api/GRestUser';
import type { GorestUserCreateRequest } from '../src/types/gorest';

test.describe('Gorest API', () => {
  test('creates, reads, updates, and deletes a user', async ({ request }) => {
    const apiToken = process.env.GOREST_API_TOKEN;

    test.skip(!apiToken, 'GOREST_API_TOKEN is not configured.');

    const api = new GRestUser(request, apiToken);
    const userPayload: GorestUserCreateRequest = {
      name: 'QA Workshop User',
      email: `qa-workshop-${Date.now()}@example.com`,
      gender: 'male',
      status: 'active',
    };

    const created = await api.createUser(userPayload);

    expect(created).toMatchObject({
      name: userPayload.name,
      email: userPayload.email,
      gender: userPayload.gender,
      status: userPayload.status,
    });
    expect(created.id).toBeGreaterThan(0);

    const fetched = await api.getUser(created.id);
    expect(fetched.id).toBe(created.id);
    expect(fetched.email).toBe(userPayload.email);

    const updated = await api.updateUser(created.id, {
      status: 'inactive',
      name: 'QA Workshop User Updated',
    });

    expect(updated.status).toBe('inactive');
    expect(updated.name).toBe('QA Workshop User Updated');

    const deleted = await api.deleteUser(created.id);
    expect(deleted).toBe(true);
  });

  test('creates a user and rejects unauthenticated access', async ({ request }) => {
    const apiToken = process.env.GOREST_API_TOKEN;

    test.skip(!apiToken, 'GOREST_API_TOKEN is not configured.');

    const api = new GRestUser(request, apiToken);
    const unauthenticatedApi = new GRestUser(request);
    const userPayload: GorestUserCreateRequest = {
      name: 'QA Workshop Security User',
      email: `qa-workshop-security-${Date.now()}@example.com`,
      gender: 'female',
      status: 'active',
    };

    const created = await api.createUser(userPayload);

    expect(created).toMatchObject({
      name: userPayload.name,
      email: userPayload.email,
      gender: userPayload.gender,
      status: userPayload.status,
    });
    expect(created.id).toBeGreaterThan(0);

    const fetched = await api.getUser(created.id);
    expect(fetched.id).toBe(created.id);
    expect(fetched.email).toBe(userPayload.email);

    await expect(
      unauthenticatedApi.createUser({
        ...userPayload,
        email: `qa-workshop-security-unauth-${Date.now()}@example.com`,
      }),
    ).rejects.toThrow(/401/);

    await api.deleteUser(created.id);
  });

  test('deleting a post removes its comments', async ({ request }) => {
    const apiToken = process.env.GOREST_API_TOKEN;

    test.skip(!apiToken, 'GOREST_API_TOKEN is not configured.');

    const userApi = new GRestUser(request, apiToken);
    const postApi = new GRestPost(request, apiToken);
    const commentApi = new GRestComment(request, apiToken);

    const firstUser = await userApi.createUser({
      name: 'QA Workshop Post Author',
      email: `qa-workshop-post-author-${Date.now()}@example.com`,
      gender: 'male',
      status: 'active',
    });

    const secondUser = await userApi.createUser({
      name: 'QA Workshop Comment Author',
      email: `qa-workshop-comment-author-${Date.now()}@example.com`,
      gender: 'female',
      status: 'active',
    });

    const post = await postApi.createPost(firstUser.id, {
      title: 'QA Workshop Post',
      body: 'This post will be deleted along with its comments.',
    });

    expect(post.user_id).toBe(firstUser.id);

    const comment = await commentApi.createComment(post.id, {
      name: secondUser.name,
      email: secondUser.email,
      body: 'This comment should disappear once the post is deleted.',
    });

    expect(comment.post_id).toBe(post.id);

    await postApi.deletePost(post.id);

    await expect(commentApi.getComment(comment.id)).rejects.toThrow(/404/);
    await expect(commentApi.getComments(post.id)).resolves.toEqual([]);

    await userApi.deleteUser(firstUser.id);
    await userApi.deleteUser(secondUser.id);
  });
});
