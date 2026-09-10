import { expect, test } from '@playwright/test'

/* global getComputedStyle */

for (const profile of ['development', 'production']) {
    test(`${profile} Tailwind theme exposes its light and dark workbench palettes`, async ({
        page,
    }) => {
        await page.goto(`/shared-shell?profile=${profile}&theme=tailwind&color-scheme=light`)

        await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(243, 246, 252)')
        await expect(page.locator('body')).toHaveCSS('color', 'rgb(23, 32, 51)')
        await expect(page.locator('body')).toHaveCSS('font-size', '15px')
        await expect(page.locator('.soa-sidebar')).toHaveCSS('background-color', 'rgb(23, 32, 51)')

        await page
            .locator('.soa-nav-link')
            .first()
            .evaluate((link) => link.classList.add('active'))
        const dutyMark = await page.locator('.soa-nav-link.active').evaluate((link) => {
            const style = getComputedStyle(link, '::before')

            return {
                background: style.backgroundColor,
                width: style.width,
            }
        })

        expect(dutyMark).toEqual({ background: 'rgb(217, 144, 35)', width: '4px' })

        await page.goto(`/shared-shell?profile=${profile}&theme=tailwind&color-scheme=dark`)

        await expect(page.locator('html')).toHaveCSS('color-scheme', 'dark')
        await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(12, 18, 32)')
        await expect(page.locator('body')).toHaveCSS('color', 'rgb(239, 243, 255)')
        await expect(page.locator('.soa-sidebar')).toHaveCSS('background-color', 'rgb(9, 15, 27)')
    })

    test(`${profile} Tailwind theme keeps keyboard focus and reduced motion accessible`, async ({
        page,
    }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' })
        await page.goto(`/shared-shell?profile=${profile}&theme=tailwind`)

        await page.keyboard.press('Tab')
        await expect(page.locator('#header-action')).toBeFocused()
        await expect(page.locator('#header-action')).toHaveCSS('outline-style', 'solid')
        await expect(page.locator('.soa-app')).toHaveCSS('transition-duration', '0s')
    })
}
