import { expect, test } from '@playwright/test';

const baseUrl = 'http://localhost:3000/';

test('page test', async ({ page }) => {
  await page.goto(baseUrl);
  const title = page.locator('h1');
  await expect(title).toHaveText('Pic Spots Community');

  await page.goto(baseUrl + 'private-profile');
  await expect(page).toHaveURL(`${baseUrl}private-profile`);

  await page.goto(baseUrl + 'community');
  await expect(page).toHaveURL(`${baseUrl}community`);

  await page.goto(baseUrl + 'upload');
  await expect(page).toHaveURL(`${baseUrl}upload`);
});
