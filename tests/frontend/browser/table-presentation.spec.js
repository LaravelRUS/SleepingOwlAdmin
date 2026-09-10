import { expect, test } from '@playwright/test'

test('AdminLTE table adapter owns Bootstrap DataTables presentation', async ({ page }) => {
    await page.goto('/table-presentation?theme=adminlte')

    await expect(page.locator('#table-presentation')).toHaveCSS('min-height', '112px')
    await expect(page.locator('.dt-search')).toHaveCSS('justify-content', 'flex-start')
    await expect(page.locator('.dt-info')).toHaveCSS('padding-left', '20px')
    await expect(page.locator('html')).toHaveCSS('--dt_background-selected', /13,\s*110,\s*253/)
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
    await expect(page.locator('.dt-paging .page-item.active .page-link')).toHaveCSS(
        'background-color',
        'rgb(36, 87, 214)',
    )
})

for (const theme of ['adminlte', 'empty', 'shadcn']) {
    test(`${theme} presents DataTables 3 column-order markup as paired arrows`, async ({
        page,
    }) => {
        await page.goto(`/table-presentation?theme=${theme}`)

        await page
            .locator('thead th')
            .first()
            .evaluate((header) => {
                header.className = 'dt-orderable-asc dt-orderable-desc'
                header.setAttribute('aria-sort', 'descending')
                header.innerHTML = [
                    '<div class="dt-column-header" style="display: flex; align-items: center">',
                    '<div class="dt-column-title">range_col</div>',
                    '<div class="dt-column-order" role="button" tabindex="0"></div>',
                    '</div>',
                ].join('')
            })

        const arrows = await page.locator('.dt-column-order').evaluate((element) => ({
            afterOpacity: getComputedStyle(element, '::after').opacity,
            afterPosition: getComputedStyle(element, '::after').position,
            beforeOpacity: getComputedStyle(element, '::before').opacity,
            beforePosition: getComputedStyle(element, '::before').position,
            display: getComputedStyle(element).display,
            headerWrap: getComputedStyle(element.parentElement).flexWrap,
            titleWhiteSpace: getComputedStyle(
                element.parentElement.querySelector('.dt-column-title'),
            ).whiteSpace,
        }))

        expect(arrows).toEqual({
            afterOpacity: '1',
            afterPosition: 'static',
            beforeOpacity: '0.45',
            beforePosition: 'static',
            display: 'grid',
            headerWrap: 'nowrap',
            titleWhiteSpace: 'nowrap',
        })
    })
}

for (const theme of ['adminlte', 'empty', 'shadcn']) {
    test(`${theme} hides the DataTables 3 sort control for non-orderable columns`, async ({
        page,
    }) => {
        await page.goto(`/table-presentation?theme=${theme}`)

        await page.locator('thead th').first().evaluate((header) => {
            header.className = 'dt-orderable-none'
            header.innerHTML = [
                '<div class="dt-column-header" style="display: flex; align-items: center">',
                '<div class="dt-column-title">range_col</div>',
                '<div class="dt-column-order" role="button" tabindex="0"></div>',
                '</div>',
            ].join('')
        })

        await expect(page.locator('.dt-column-order')).toHaveCSS('display', 'none')
    })
}

for (const [theme, primary] of Object.entries({
    adminlte: 'rgb(60, 141, 188)',
    empty: 'rgb(37, 99, 235)',
    shadcn: 'rgb(36, 87, 214)',
})) {
    test(`${theme} reuses the shared pagination presentation`, async ({ page }) => {
        await page.goto(`/table-presentation?theme=${theme}`)

        await expect(page.locator('.soa-pagination > ul')).toHaveCSS('list-style-type', 'none')
        await expect(page.locator('.soa-pagination [aria-current="page"]')).toHaveCSS(
            'background-color',
            primary,
        )
        await expect(page.locator('.dt-paging .page-item.active .page-link')).toHaveCSS(
            'background-color',
            primary,
        )
        await expect(page.locator('.dt-paging .page-link').first()).toHaveCSS('min-height', '36px')
        await expect(page.locator('.dt-paging .page-item').first()).toHaveCSS('border-top-width', '0px')
    })
}

for (const [theme, { margin, minHeight }] of Object.entries({
    adminlte: { margin: '20px', minHeight: '34px' },
    empty: { margin: '20px', minHeight: '34px' },
    shadcn: { margin: '96px', minHeight: '36px' },
})) {
    test(`${theme} reuses the shared page-jump presentation`, async ({ page }) => {
        await page.goto(`/table-presentation?theme=${theme}`)

        await expect(page.locator('.soa-dt-page-jump')).toHaveCSS('display', 'inline-flex')
        await expect(page.locator('.soa-dt-page-jump')).toHaveCSS('margin-right', margin)
        await expect(page.locator('.soa-dt-page-jump-input')).toHaveCSS('min-height', minHeight)
    })
}

for (const theme of ['adminlte', 'empty', 'shadcn']) {
    test(`${theme} auto-update presentation keeps the progress line beside its toggle`, async ({
        page,
    }) => {
        await page.goto(`/table-presentation?theme=${theme}`)

        await expect(page.locator('.autoupdater-bar')).toHaveCSS('height', '36px')
        await expect(page.locator('.autoupdater-bar > svg')).toHaveCSS('opacity', '0.45')
        await expect(page.locator('#autoupdate-progress')).toHaveCSS('stroke', 'rgb(18, 52, 86)')
        await expect(page.locator('.autoupdater-toggle')).toHaveCSS('right', '0px')
    })
}
