import { expect, test } from '@playwright/test'

for (const [theme, background, width, text] of [
    ['legacy-adminlte', 'rgb(52, 58, 64)', '250px', 'rgb(255, 255, 255)'],
    ['tailwind', 'rgb(16, 35, 53)', '272px', 'rgb(219, 231, 242)'],
]) {
    test(`${theme} sidebar adapter owns presentation`, async ({ page }) => {
        await page.goto(`/sidebar-presentation?theme=${theme}`)
        const sidebar = page.locator('#presented-sidebar')

        await expect(sidebar).toHaveCSS('background-color', background)
        await expect(sidebar).toHaveCSS('width', width)
        await expect(page.locator('#presented-link')).toHaveCSS('color', text)
    })
}
