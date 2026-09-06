import { expect, test } from '@playwright/test'

test('delegated listeners match nested targets and can be removed', async ({ page }) => {
    await page.goto('/dom-listeners')
    await expect(page.locator('html')).toHaveAttribute('data-ready', 'true')

    await page.locator('#save-label').click()
    await expect(page.locator('#result')).toHaveText(
        JSON.stringify({ action: 'save', currentTarget: 'actions' }),
    )

    await page.evaluate(() => globalThis.stopDelegation())
    await page.locator('#result').evaluate((element) => {
        element.textContent = ''
    })
    await page.locator('#save-label').click()
    await expect(page.locator('#result')).toHaveText('')
})
