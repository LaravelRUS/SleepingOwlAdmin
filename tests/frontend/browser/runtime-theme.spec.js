import { expect, test } from '@playwright/test'

test('runtime sidebar color overrides both schemes without rebuilding assets', async ({ page }) => {
    await page.goto('/runtime-theme')

    await expect(page.locator('html')).toHaveAttribute('data-color-scheme', 'light')
    await expect(page.locator('#sidebar')).toHaveCSS('background-color', 'rgb(18, 52, 86)')

    await page.locator('#theme-mode').dispatchEvent('click')
    await expect(page.locator('html')).toHaveAttribute('data-color-scheme', 'dark')
    await expect(page.locator('#sidebar')).toHaveCSS('background-color', 'rgb(18, 52, 86)')

    await page.locator('[data-runtime-properties]').evaluate((style) => style.remove())
    await expect(page.locator('#sidebar')).toHaveCSS('background-color', 'rgb(52, 58, 64)')
})
