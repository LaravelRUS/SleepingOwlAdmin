import { expect, test } from '@playwright/test'

test('AdminLTE table adapter owns Bootstrap DataTables presentation', async ({ page }) => {
    await page.goto('/table-presentation?theme=adminlte')

    await expect(page.locator('#table-presentation')).toHaveCSS('min-height', '112px')
    await expect(page.locator('.dt-search')).toHaveCSS('justify-content', 'flex-start')
    await expect(page.locator('.dt-info')).toHaveCSS('padding-left', '20px')
    await expect(page.locator('html')).toHaveCSS('--dt_background-selected', /13,\s*110,\s*253/)
    await expect(page.locator('td.highlight')).toHaveCSS('background-color', 'rgb(242, 242, 242)')
})

for (const theme of ['adminlte', 'empty', 'tabler', 'tailwind']) {
    test(`${theme} presents DataTables 3 column-order markup as Bootstrap-style arrows`, async ({
        page,
    }) => {
        await page.goto(`/table-presentation?theme=${theme}`)

        await page
            .locator('thead th')
            .first()
            .evaluate((header) => {
                header.closest('table').className = 'table datatables'
                header.className = 'dt-orderable-asc dt-orderable-desc dt-ordering-desc'
                header.innerHTML = [
                    '<div class="dt-column-header" style="display: flex; align-items: center">',
                    '<div class="dt-column-title">range_col</div>',
                    '<div class="dt-column-order" role="button" tabindex="0"></div>',
                    '</div>',
                ].join('')
            })

        const arrows = await page.locator('.dt-column-order').evaluate(readColumnOrderPresentation)

        expect(arrows).toEqual({
            afterBorderColor: 'rgb(51, 51, 51)',
            afterOpacity: '0.65',
            afterPosition: 'absolute',
            beforeBorderColor: 'rgb(51, 51, 51)',
            beforeOpacity: '0.125',
            beforePosition: 'absolute',
            display: 'block',
            headerWrap: 'nowrap',
            titleWhiteSpace: 'normal',
        })
    })
}

function readColumnOrderPresentation(element) {
    const styles = element.ownerDocument.defaultView.getComputedStyle

    return {
        afterBorderColor: styles(element, '::after').borderTopColor,
        afterOpacity: styles(element, '::after').opacity,
        afterPosition: styles(element, '::after').position,
        beforeBorderColor: styles(element, '::before').borderBottomColor,
        beforeOpacity: styles(element, '::before').opacity,
        beforePosition: styles(element, '::before').position,
        display: styles(element).display,
        headerWrap: styles(element.parentElement).flexWrap,
        titleWhiteSpace: styles(element.parentElement.querySelector('.dt-column-title')).whiteSpace,
    }
}

for (const theme of ['adminlte', 'empty', 'tabler', 'tailwind']) {
    test(`${theme} hides the DataTables 3 sort control for non-orderable columns`, async ({
        page,
    }) => {
        await page.goto(`/table-presentation?theme=${theme}`)

        await page
            .locator('thead th')
            .first()
            .evaluate((header) => {
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
        await expect(page.locator('.dt-paging .page-item').first()).toHaveCSS(
            'border-top-width',
            '0px',
        )
    })
}

for (const [theme, { margin, minHeight }] of Object.entries({
    adminlte: { margin: '20px', minHeight: '34px' },
    empty: { margin: '20px', minHeight: '34px' },
})) {
    test(`${theme} reuses the shared page-jump presentation`, async ({ page }) => {
        await page.goto(`/table-presentation?theme=${theme}`)

        await expect(page.locator('.soa-dt-page-jump')).toHaveCSS('display', 'inline-flex')
        await expect(page.locator('.soa-dt-page-jump')).toHaveCSS('margin-right', margin)
        await expect(page.locator('.soa-dt-page-jump-input')).toHaveCSS('min-height', minHeight)
    })
}

for (const theme of ['adminlte', 'empty', 'tabler', 'tailwind']) {
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
