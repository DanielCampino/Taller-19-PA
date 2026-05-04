const { test } = require('../fixtures/fixtures');
const { expect } = require('@playwright/test');

test('Agregar empleado (positivo)', async ({ loggedPage }) => {
  await loggedPage.locator('span:has-text("PIM")').click();
  await loggedPage.locator('button:has-text("Add")').click();
  await loggedPage.locator('input[name="firstName"]').fill('Juan');
  await loggedPage.locator('input[name="lastName"]').fill('Perez');

  const IdInput = loggedPage.locator(
      'xpath=//label[normalize-space()="Employee Id"]/following::input[1]'
  );
  const employeeId = Date.now().toString().slice(-8);
  await IdInput.fill(employeeId);

  await loggedPage.locator('button:has-text("Save")').click();

  //Aserciones
  await expect(loggedPage).toHaveURL(/viewPersonalDetails/);
  await expect(loggedPage.locator('h6').nth(2)).toContainText('Personal Details');
});

test('Agregar empleado (negativo - campos vacios)', async ({ loggedPage }) => {
  await loggedPage.locator('span:has-text("PIM")').click();
  await loggedPage.locator('button:has-text("Add")').click();
  const IdInput = loggedPage.locator(
      'xpath=//label[normalize-space()="Employee Id"]/following::input[1]'
  );
  const employeeId = Date.now().toString().slice(-8);
  await IdInput.fill(employeeId);
  await loggedPage.locator('button:has-text("Save")').click();

  //Aserciones
  await expect(loggedPage.locator('.oxd-input-field-error-message')).toHaveCount(2);
  await expect(loggedPage.locator('.oxd-input-field-error-message').first())
    .toContainText('Required');
  await expect(loggedPage).not.toHaveURL(/viewPersonalDetails/);
});