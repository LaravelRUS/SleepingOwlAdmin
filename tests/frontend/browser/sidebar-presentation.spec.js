import { expect, test } from '@playwright/test'

for (const [theme, background, width, text] of [
    ['adminlte', 'rgb(52, 58, 64)', '250px', 'rgb(255, 255, 255)'],
    ['shadcn', 'rgb(16, 35, 53)', '272px', 'rgb(219, 231, 242)'],
    ['tabler', 'rgb(19, 34, 56)', '256px', 'rgb(231, 237, 245)'],
]) {
    test(`${theme} sidebar adapter owns presentation`, async ({ page }) => {
        await page.goto(`/sidebar-presentation?theme=${theme}`)
        const sidebar = page.locator('#presented-sidebar')

        await expect(sidebar).toHaveCSS('background-color', background)
        await expect(sidebar).toHaveCSS('width', width)
        await expect(page.locator('#presented-link')).toHaveCSS('color', text)
    })
}

test('AdminLTE keeps the tree arrow vertically centered while opening a branch', async ({
    page,
}) => {
    await page.goto('/sidebar-presentation?theme=adminlte')
    const arrow = page.locator('#presented-arrow')
    const centerOffset = () =>
        arrow.evaluate((element) => {
            const arrowBounds = element.getBoundingClientRect()
            const linkBounds = element.closest('.nav-link').getBoundingClientRect()

            return (
                arrowBounds.top + arrowBounds.height / 2 - (linkBounds.top + linkBounds.height / 2)
            )
        })

    const closedOffset = await centerOffset()
    await page.locator('#presented-item').evaluate((element) => {
        element.classList.add('menu-open')
    })

    await expect.poll(centerOffset).toBeCloseTo(closedOffset, 1)
})
