import { test, expect } from '@playwright/test';

test('example API test', async ({ request }) => {
  const response = await request.get('/api/health');
  expect(response.status()).toBe(200);
});
