import { expect, test } from '@playwright/test'

test('AdminLTE table adapter owns Bootstrap DataTables presentation', async ({ page }) => {
    await page.goto('/table-presentation?theme=adminlte')

    await expect(page.locator('#table-presentation')).toHaveCSS('min-height', '112px')
    await expect(page.locator('.dt-search')).toHaveCSS('justify-content', 'flex-start')
    await expect(page.locator('.dt-info')).toHaveCSS('padding-left', '20px')
    await expect(page.locator('html')).toHaveCSS('--dt_background-selected', '13,110,253')
    await expect(page.locator('td.highlight')).toHaveCSS('background-color', 'rgb(242, 242, 242)')
})

test('Tailwind table adapter is standalone, compact and theme-token driven', async ({ page }) => {
    await page.goto('/table-presentation?theme=shadcn')

    const containerBox = await page.locator('#table-presentation').boundingBox()
    const searchBox = await page.locator('.dt-search').boundingBox()

    expect(searchBox?.x).toBe(containerBox?.x)
    await expect(page.locator('#table-search')).toHaveCSS('border-radius', '6px')
    await expect(page.locator('thead th').first()).toHaveCSS('text-transform', 'uppercase')
    await expect(page.locator('tbody tr.selected')).toHaveCSS(
        'background-color',
        'rgb(230, 238, 252)',
    )
    await expect(page.locator('.dt-paging-button.current')).toHaveCSS(
        'background-color',
        'rgb(36, 87, 214)',
    )
})

for (const [theme, height, right] of [
    ['adminlte', '0px', '6px'],
    ['shadcn', '36px', '0px'],
]) {
    test(`${theme} auto-update presentation keeps the progress line beside its toggle`, async ({
        page,
    }) => {
        await page.goto(`/table-presentation?theme=${theme}`)

        await expect(page.locator('.autoupdater-bar')).toHaveCSS('height', height)
        await expect(page.locator('.autoupdater-bar > svg')).toHaveCSS('opacity', '0.45')
        await expect(page.locator('#autoupdate-progress')).toHaveCSS('stroke', 'rgb(18, 52, 86)')
        await expect(page.locator('.autoupdater-toggle')).toHaveCSS('right', right)
    })
}
