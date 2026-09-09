import { expect, test } from '@playwright/test'

for (const [theme, surface] of [
    ['adminlte', 'rgb(0, 0, 0)'],
    ['shadcn', 'rgb(16, 35, 53)'],
]) {
    test(`${theme} tooltip adapter owns presentation`, async ({ page }) => {
        await page.goto(`/tooltip-presentation?theme=${theme}`)
        const tooltip = page.locator('[data-tooltip-popup]')

        await expect(tooltip).toHaveCSS('background-color', surface)
        await expect(tooltip).toHaveCSS('pointer-events', 'none')
    })
}
