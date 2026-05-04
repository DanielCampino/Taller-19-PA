const base = require('@playwright/test');
const { expect } = require('@playwright/test');

exports.test = base.test.extend({
  env: [async ({}, use) => {
    await use({
      baseUrl: 'https://opensource-demo.orangehrmlive.com',
      username: 'Admin',
      password: 'admin123',
      claimType: 'Travel Allowance',
      currency: 'United States Dollar',
    });
  }, { scope: 'worker' }],

  loggedPage: async ({ page, env }, use) => {
    await page.goto(env.baseUrl + '/web/index.php/auth/login');

    await page.fill('input[name="username"]', env.username);
    await page.fill('input[name="password"]', env.password);
    await page.click('button[type="submit"]');

    await use(page);
  },


  employee: async ({ loggedPage, env }, use) => {

    const firstName = 'Test';
    const lastName = 'Employee';
    const fullName = `${firstName} ${lastName}`;

    await loggedPage.locator('span:has-text("PIM")').click();
    await loggedPage.locator('button:has-text("Add")').click();

    const firstNameInput = loggedPage.locator('input[name="firstName"]');
    await firstNameInput.waitFor({ state: 'visible' });
    await firstNameInput.fill(firstName);

    await loggedPage.locator('input[name="lastName"]').fill(lastName);

    const IdInput = loggedPage.locator(
      'xpath=//label[normalize-space()="Employee Id"]/following::input[1]'
    );
    const employeeID = Date.now().toString().slice(-8);
    await IdInput.fill(employeeID);

    await loggedPage.locator('button:has-text("Save")').click();
    await loggedPage.waitForURL(/viewPersonalDetails/, { timeout: 10000 });

    await expect(
      loggedPage.getByText('Personal Details').first()
    ).toBeVisible();

    //Data Expuesta
    await use(fullName);
  }
});