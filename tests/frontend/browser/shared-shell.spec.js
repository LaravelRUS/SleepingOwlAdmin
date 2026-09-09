/* global document, getComputedStyle, innerHeight, innerWidth */

import { expect, test } from '@playwright/test'

const themes = ['adminlte', 'framework-free-test', 'shadcn']

for (const profile of ['development', 'production']) {
    for (const theme of themes) {
        test(`${profile} ${theme} uses the shared desktop shell geometry`, async ({ page }) => {
            await page.setViewportSize({ width: 1280, height: 800 })
            await page.goto(`/shared-shell?profile=${profile}&theme=${theme}`)

            await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
            await expect(page.locator('.soa-app')).toHaveCSS('display', 'grid')
            await expect(page.locator('#header-action')).toHaveCSS('min-width', '40px')
            await expect(page.locator('#header-action')).toHaveCSS('min-height', '40px')

            const geometry = await shellGeometry(page)
            expect(geometry.header).toMatchObject({ height: 56, left: 256, width: 1024 })
            expect(geometry.sidebar).toMatchObject({ left: 0, width: 256 })
            expect(geometry.main).toMatchObject({ left: 256, width: 1024 })
            expect(geometry.footer).toMatchObject({ left: 256, width: 1024 })
            expect(geometry.sidebar.height).toBeGreaterThanOrEqual(geometry.viewport.height)

            await expectDesktopScrollControls(page)
            await expectFixedControlsAvoidContent(page, 16)

            await page.locator('body').evaluate((body) => body.classList.add('sidebar-collapse'))
            await expect(page.locator('#shell-sidebar')).toHaveCSS('width', '64px')
            await expect(page.locator('.soa-brand-mini')).toHaveCSS('display', 'flex')
            await expect(page.locator('.soa-brand-text')).toBeHidden()
        })

        test(`${profile} ${theme} uses the shared mobile shell and overlay geometry`, async ({
            page,
        }) => {
            await page.setViewportSize({ width: 390, height: 800 })
            await page.goto(`/shared-shell?profile=${profile}&theme=${theme}`)
            await page.locator('body').evaluate((body) => body.classList.add('sidebar-collapse'))

            await expect(page.locator('.soa-app')).toHaveCSS('display', 'block')
            await expect(page.locator('#shell-sidebar')).not.toHaveCSS('transform', 'none')
            await expect(page.locator('#sidebar-overlay')).toHaveCSS('display', 'none')

            await page.locator('body').evaluate((body) => body.classList.add('sidebar-open'))
            await expect(page.locator('#shell-sidebar')).toHaveCSS('transform', 'none')
            await expect(page.locator('#shell-sidebar')).toHaveCSS('width', '256px')
            await expect(page.locator('#sidebar-overlay')).toHaveCSS('display', 'block')
            await expect(page.locator('.soa-nav-link-content')).toHaveCSS('display', 'flex')

            const geometry = await shellGeometry(page)
            expect(geometry.header).toMatchObject({ height: 56, left: 0, width: 390 })
            expect(geometry.main).toMatchObject({ left: 0, width: 390 })
            expect(geometry.footer).toMatchObject({ left: 0, width: 390 })

            const controls = await controlGeometry(page)
            expect(controls.bottom.right).toBe(12)
            expect(controls.bottom.bottom).toBe(16)
            expect(controls.bottom.width).toBe(44)
            expect(controls.top).toMatchObject({ bottom: 60, right: 12, width: 44 })

            await expectFixedControlsAvoidContent(page, 12)
        })
    }
}

test('shared shell focus and reduced motion contracts are theme neutral', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/shared-shell?profile=development&theme=framework-free-test')

    await page.keyboard.press('Tab')
    await expect(page.locator('#header-action')).toBeFocused()
    await expect(page.locator('#header-action')).toHaveCSS('outline-style', 'solid')
    await expect(page.locator('.soa-app')).toHaveCSS('transition-duration', '0s')
    await expect(page.locator('#scrolltobottom')).toHaveCSS('transition-duration', '0s')
})

function shellGeometry(page) {
    return page.evaluate(() => {
        const rectangle = (selector) => {
            const { height, left, width } = document.querySelector(selector).getBoundingClientRect()

            return { height, left, width }
        }

        return {
            footer: rectangle('.soa-footer'),
            header: rectangle('.soa-header'),
            main: rectangle('.soa-main'),
            sidebar: rectangle('.soa-sidebar'),
            viewport: { height: innerHeight, width: innerWidth },
        }
    })
}

function controlGeometry(page) {
    return page.evaluate(() => {
        const control = (selector) => {
            const element = document.querySelector(selector)
            const rect = element.getBoundingClientRect()

            return {
                bottom: innerHeight - rect.bottom,
                right: innerWidth - rect.right,
                visibility: getComputedStyle(element).visibility,
                width: rect.width,
            }
        }

        return {
            bottom: control('.soa-scroll-control-bottom'),
            top: control('.soa-scroll-control-top'),
        }
    })
}

async function expectDesktopScrollControls(page) {
    const controls = await controlGeometry(page)

    expect(controls.bottom).toMatchObject({ bottom: 16, right: 16, width: 44 })
    expect(controls.top).toMatchObject({ bottom: 60, visibility: 'hidden' })
    expect(controls.bottom.visibility).toBe('visible')

    await page.locator('#scrolltotop').evaluate((element) => element.classList.add('show'))
    await page.locator('#scrolltobottom').evaluate((element) => element.classList.add('hide'))
    await expect(page.locator('#scrolltotop')).toHaveCSS('visibility', 'visible')
    await expect(page.locator('#scrolltobottom')).toHaveCSS('visibility', 'hidden')
}

async function expectFixedControlsAvoidContent(page, minimumGap) {
    await page.locator('.soa-footer').scrollIntoViewIfNeeded()
    await page.locator('#scrolltobottom').evaluate((element) => element.classList.remove('hide'))
    const footerGap = await page.evaluate(() => {
        const footer = document.querySelector('.soa-footer-inner').getBoundingClientRect()
        const control = document.querySelector('#scrolltobottom').getBoundingClientRect()

        return control.left - footer.right
    })

    expect(footerGap).toBeGreaterThanOrEqual(minimumGap)

    await page.evaluate(() => {
        const editor = document.createElement('div')
        editor.className = 'soa-inline-editor'
        editor.dataset.inlineEditorRoot = ''
        document.body.append(editor)
    })
    await expect(page.locator('#scrolltotop')).toHaveCSS('visibility', 'hidden')
    await expect(page.locator('#scrolltobottom')).toHaveCSS('visibility', 'hidden')

    await page.locator('[data-inline-editor-root]').evaluate((editor) => editor.remove())
    await expect(page.locator('#scrolltobottom')).toHaveCSS('visibility', 'visible')
}
