const { test } = require('../fixtures/fixtures');
const { expect } = require('@playwright/test');

test('Buscar empleado en directory (positivo)', async ({ loggedPage, employee }) => {

  //Buscar Empleado
  await loggedPage.locator('span:has-text("Directory")').click();

  const nameInput = loggedPage.locator(
      'xpath=//label[normalize-space()="Employee Name"]/ancestor::div[contains(@class,"oxd-input-group")]//input'
  );
  await nameInput.fill(employee);
  await loggedPage.locator('button:has-text("Search")').first().click();
  const results = loggedPage.locator('.oxd-sheet');
  const employeeFound = results.filter({ hasText: employee });

  //Aserciones
  await expect(results).not.toHaveCount(0);
  await expect(employeeFound).toBeVisible();
  await expect(employeeFound).toContainText(employee);
});

test('Buscar empleado en directory (negativo - no existe)', async ({ loggedPage }) => {
  await loggedPage.locator('span:has-text("Directory")').click();
  const input = loggedPage.locator('input').filter({ hasText: '' }).first();
  await input.fill('EmpleadoInexistenteXYZ');
  await loggedPage.locator('button:has-text("Search")').click();
  const results = loggedPage.locator('.oxd-card');

  //Aserciones
  await expect(results).toHaveCount(0);
  await expect(loggedPage.locator('body')).toContainText('No Records Found');
});