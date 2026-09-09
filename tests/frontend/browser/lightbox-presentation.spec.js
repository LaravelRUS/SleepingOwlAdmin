import { expect, test } from '@playwright/test'

for (const [theme, controlSurface] of [
    ['adminlte', 'rgb(52, 58, 64)'],
    ['shadcn', 'rgb(20, 32, 51)'],
]) {
    test(`${theme} lightbox adapter owns controls and caption presentation`, async ({ page }) => {
        await page.goto(`/lightbox-presentation?theme=${theme}`)

        await expect(page.locator('.gbtn')).toHaveCSS('width', '44px')
        await expect(page.locator('.gbtn')).toHaveCSS('background-color', controlSurface)
        await expect(page.locator('.gslide-description')).toHaveCSS(
            'background-color',
            'rgb(255, 255, 255)',
        )
    })
}
