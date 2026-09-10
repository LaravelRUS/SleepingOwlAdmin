import { expect, test } from '@playwright/test'

for (const [theme, surface, radius] of [
    ['adminlte', 'rgb(255, 255, 255)', '4px'],
    ['empty', 'rgb(255, 255, 255)', '4px'],
    ['tabler', 'rgb(255, 255, 255)', '6px'],
    ['tailwind', 'rgb(255, 255, 255)', '10px'],
]) {
    test(`${theme} dropdown uses shared presentation`, async ({ page }) => {
        await page.goto(`/dropdown-presentation?theme=${theme}`)
        const menu = page.locator('.dropdown-menu')

        await expect(menu).toHaveCSS('background-color', surface)
        await expect(menu).toHaveCSS('border-radius', radius)
        await expect(menu).toHaveCSS('position', 'absolute')
    })
}
