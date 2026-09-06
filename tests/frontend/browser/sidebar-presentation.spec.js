import { expect, test } from '@playwright/test'

for (const [theme, background, width] of [
    ['legacy-adminlte', 'rgb(52, 58, 64)', '250px'],
    ['tailwind', 'rgb(15, 23, 42)', '256px'],
]) {
    test(`${theme} sidebar adapter owns presentation`, async ({ page }) => {
        await page.goto(`/sidebar-presentation?theme=${theme}`)
        const sidebar = page.locator('#presented-sidebar')

        await expect(sidebar).toHaveCSS('background-color', background)
        await expect(sidebar).toHaveCSS('width', width)
        await expect(page.locator('#presented-link')).toHaveCSS('color', 'rgb(255, 255, 255)')
    })
}
