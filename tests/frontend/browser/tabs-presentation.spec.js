import { expect, test } from '@playwright/test'

for (const [theme, activeSurface] of [
    ['adminlte', 'rgb(255, 255, 255)'],
    ['tabler', 'rgb(220, 236, 255)'],
]) {
    test(`${theme} tabs adapter owns active and focus presentation`, async ({ page }) => {
        await page.goto(`/tabs-presentation?theme=${theme}`)
        const active = page.locator('[data-tab].active')

        await expect(active).toHaveCSS('background-color', activeSurface)
        await expect(active).toHaveCSS('text-decoration-line', 'none')
    })
}
