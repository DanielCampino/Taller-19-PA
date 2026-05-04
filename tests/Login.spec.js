const { test } = require('../fixtures/fixtures');
const { expect } = require('@playwright/test');

test('Login exitoso', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

  await page.locator('input[name="username"]').fill('Admin');
  await page.locator('input[name="password"]').fill('admin123');
  await page.locator('button').last().click();

  //Aserciones
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.locator('.oxd-topbar-header-breadcrumb')).toBeVisible();
});

test('Login fallido', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

  await page.locator('input[name="username"]').fill('Admin');
  await page.locator('input[name="password"]').fill('randompass');
  await page.locator('button[type="submit"]').click();

  //Aserciones
  await expect(page.locator('.oxd-alert-content')).toBeVisible();
  await expect(page.locator('.oxd-alert-content')).toContainText('Invalid');
});