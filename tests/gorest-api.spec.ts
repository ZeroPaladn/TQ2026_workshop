import { expect, test } from '@playwright/test';
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
});
