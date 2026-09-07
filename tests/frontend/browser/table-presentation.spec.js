import { expect, test } from '@playwright/test'

test('AdminLTE table adapter owns Bootstrap DataTables presentation', async ({ page }) => {
    await page.goto('/table-presentation?theme=legacy-adminlte')

    await expect(page.locator('#table-presentation')).toHaveCSS('min-height', '112px')
    await expect(page.locator('.dt-info')).toHaveCSS('padding-left', '20px')
    await expect(page.locator('html')).toHaveCSS('--dt_background-selected', '2,117,216')
    await expect(page.locator('td.highlight')).toHaveCSS('background-color', 'rgb(242, 242, 242)')
})

test('Tailwind table adapter is standalone, compact and theme-token driven', async ({ page }) => {
    await page.goto('/table-presentation?theme=tailwind')

    await expect(page.locator('#table-search')).toHaveCSS('border-radius', '6px')
    await expect(page.locator('thead th').first()).toHaveCSS('text-transform', 'uppercase')
    await expect(page.locator('tbody tr.selected')).toHaveCSS(
        'background-color',
        'rgb(239, 246, 255)',
    )
    await expect(page.locator('.dt-paging-button.current')).toHaveCSS(
        'background-color',
        'rgb(37, 99, 235)',
    )
})
