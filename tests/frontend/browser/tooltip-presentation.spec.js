import { expect, test } from '@playwright/test'

for (const [theme, surface] of [
    ['legacy-adminlte', 'rgb(0, 0, 0)'],
    ['tailwind', 'rgb(17, 24, 39)'],
]) {
    test(`${theme} tooltip adapter owns presentation`, async ({ page }) => {
        await page.goto(`/tooltip-presentation?theme=${theme}`)
        const tooltip = page.locator('[data-soa-tooltip-popup]')

        await expect(tooltip).toHaveCSS('background-color', surface)
        await expect(tooltip).toHaveCSS('pointer-events', 'none')
    })
}
