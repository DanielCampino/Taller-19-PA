const { test } = require('../fixtures/fixtures');
const { expect } = require('@playwright/test');

test('Agregar usuario (positivo)', async ({ loggedPage, employee }) => {

  //Crear Usuario
  await loggedPage.locator('span:has-text("Admin")').click();
  await loggedPage.locator('button:has-text("Add")').click();

  const employeeInput = loggedPage.locator(
      'xpath=//label[normalize-space()="Employee Name"]/ancestor::div[contains(@class,"oxd-input-group")]//input'
  );

  const usernameInput = loggedPage.locator(
      'xpath=//label[normalize-space()="Username"]/ancestor::div[contains(@class,"oxd-input-group")]//input'
  );

  await employeeInput.fill(employee);
  const option = loggedPage.locator('.oxd-autocomplete-option')
    .filter({ hasText: employee }).first();
  await option.waitFor();
  await option.click();

  await loggedPage.locator('.oxd-select-text').first().click();
  await loggedPage.locator('.oxd-select-dropdown >> text=Admin').click();

  await loggedPage.locator('.oxd-select-text').nth(1).click();
  await loggedPage.locator('.oxd-select-dropdown >> text=Enabled').click()

  await usernameInput.fill(employee);
  await loggedPage.locator('input[type="password"]').first().fill('Pass123!');
  await loggedPage.locator('input[type="password"]').last().fill('Pass123!');
  await loggedPage.locator('button:has-text("Save")').click();

  //Aserciones
  await expect(loggedPage.locator('.oxd-toast')).toBeVisible();
  await expect(loggedPage.locator('.oxd-toast')).toContainText('Success');
});

test('Agregar usuario (campos inválidos)', async ({ loggedPage }) => {
  await loggedPage.locator('span:has-text("Admin")').click();
  await loggedPage.locator('button:has-text("Add")').click();
  await loggedPage.locator('input').nth(1).fill('');
  await loggedPage.locator('.oxd-select-text').first().click();
  await loggedPage.locator('.oxd-select-dropdown >> text=Admin').click();
  await loggedPage.locator('input[type="password"]').first().fill('Pass123!');
  await loggedPage.locator('input[type="password"]').last().fill('WrongPass!');
  await loggedPage.locator('button:has-text("Save")').click();

  //Aserciones
  await expect(loggedPage.locator('.oxd-input-field-error-message')).toBeVisible();
  await expect(loggedPage.locator('.oxd-input-field-error-message')).toContainText(/match/i);
  await expect(loggedPage.locator('.oxd-toast')).not.toBeVisible();
});