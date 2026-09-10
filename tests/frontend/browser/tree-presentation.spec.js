import { expect, test } from '@playwright/test'

for (const theme of ['adminlte', 'tabler', 'tailwind']) {
    test(`${theme} tree adapter owns nested presentation`, async ({ page }) => {
        await page.goto(`/tree-presentation?theme=${theme}`)

        await expect(page.locator('.soa-tree-content').first()).toHaveCSS('display', 'flex')
        await expect(page.locator('.soa-tree-content').first()).toHaveCSS(
            'border-bottom-style',
            'solid',
        )
        await expect(page.locator('.soa-tree-handle')).toHaveCSS('cursor', 'grab')
        await expect(page.locator('.soa-tree-toggle')).toHaveCSS('position', 'absolute')
        await expect(page.locator('.soa-tree-list .soa-tree-list')).toHaveCSS(
            'padding-left',
            '24px',
        )
    })
}
