import { expect, test } from '@playwright/test'

for (const [theme, activeSurface] of [
    ['adminlte', 'rgb(255, 255, 255)'],
    ['tailwind', 'rgb(230, 238, 252)'],
]) {
    test(`${theme} tabs adapter owns active and focus presentation`, async ({ page }) => {
        await page.goto(`/tabs-presentation?theme=${theme}`)
        const active = page.locator('[data-tab].active')

        await expect(active).toHaveCSS('background-color', activeSurface)
        await expect(active).toHaveCSS('text-decoration-line', 'none')
    })
}
