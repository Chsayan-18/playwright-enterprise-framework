import {test, expect} from '@playwright/test';
test('SD_TC_001: Verify user log in with valid username and password', async ({page}) => {
    await page.goto('');

    await expect(page).toHaveTitle('Swag Labs');
    await expect(page.getByPlaceholder('Username')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
    await expect(page.getByRole('button', {name: 'Login'})).toBeVisible();

    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', {name: 'Login'}).click();

    await expect(page).toHaveURL(/inventory.html/);
})