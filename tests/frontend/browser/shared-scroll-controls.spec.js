/* global innerHeight, scrollY, window */

import { expect, test } from '@playwright/test'

for (const profile of ['development', 'production']) {
    test(`${profile} empty theme shows and activates shared scroll-to-top`, async ({ page }) => {
        const errors = []
        page.on('pageerror', (error) => errors.push(error.message))

        await page.setViewportSize({ height: 600, width: 1000 })
        await page.goto(`/shared-scroll-controls?profile=${profile}`)

        const scrollTop = page.locator('#scrolltotop')
        await expect(scrollTop).not.toHaveClass(/\bshow\b/)
        await expect(scrollTop).toHaveCSS('opacity', '0')
        await expect(scrollTop).toHaveCSS('visibility', 'hidden')

        await page.evaluate(() => window.scrollTo(0, innerHeight + 20))

        await expect(scrollTop).toHaveClass(/\bshow\b/)
        await expect(scrollTop).toHaveCSS('opacity', '1')
        await expect(scrollTop).toHaveCSS('visibility', 'visible')

        await scrollTop.click()
        await expect.poll(() => page.evaluate(() => scrollY)).toBe(0)
        expect(errors).toEqual([])
    })
}
