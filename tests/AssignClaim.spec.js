const { test } = require('../fixtures/fixtures');
const { expect } = require('@playwright/test');

test('Asignar claim (positivo)', async ({ loggedPage, employee, env }) => {

  await loggedPage.locator('span:has-text("Claim")').click();
  await loggedPage.locator('button:has-text("Assign Claim")').click();

  const employeeInput = loggedPage.locator(
      'xpath=//label[normalize-space()="Employee Name"]/ancestor::div[contains(@class,"oxd-input-group")]//input'
  );
  await employeeInput.waitFor({ state: 'visible' });
  await employeeInput.fill(employee);

  const option = loggedPage.locator('.oxd-autocomplete-option')
    .filter({ hasText: employee }).first();
  await option.waitFor();
  await option.click();

  await loggedPage.locator('.oxd-select-text').nth(0).click();
  await loggedPage.locator(`.oxd-select-dropdown >> text=${env.claimType}`).click();

  await loggedPage.locator('.oxd-select-text').nth(1).click();
  await loggedPage.locator(`.oxd-select-dropdown >> text=${env.currency}`).click();

  await loggedPage.locator('button:has-text("Create")').click();

  //Aserciones
  await expect(loggedPage.locator('.oxd-toast')).toBeVisible();
  await expect(loggedPage.locator('.oxd-toast')).toContainText('Success');
});

test('Asignar claim (negativo - campos requeridos)', async ({ loggedPage }) => {
  await loggedPage.locator('span:has-text("Claim")').click();
  await loggedPage.locator('button:has-text("Assign Claim")').click();
  await loggedPage.locator('button:has-text("Create")').click();
  const errors = loggedPage.locator('.oxd-input-field-error-message');

  //Aserciones
  await expect(errors.first()).toBeVisible();
  await expect(errors.first()).toContainText('Required');
  await expect(loggedPage.locator('.oxd-toast')).not.toBeVisible();
});