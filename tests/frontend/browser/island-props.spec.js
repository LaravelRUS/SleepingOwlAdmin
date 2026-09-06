import { expect, test } from '@playwright/test'

test('typed data and JSON props work in a real browser module', async ({ page }) => {
    const pageErrors = []
    page.on('pageerror', (error) => pageErrors.push(error.message))

    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-ready', 'true')

    const result = JSON.parse(await page.locator('#result').textContent())
    expect(result).toEqual({
        dataset: { enabled: false, limit: 25, name: 'orders' },
        payload: { filters: ['active'], page: 2 },
    })
    expect(pageErrors).toEqual([])
})
