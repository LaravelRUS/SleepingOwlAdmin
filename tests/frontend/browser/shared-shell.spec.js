/* global document, getComputedStyle, innerHeight, innerWidth */

import { expect, test } from '@playwright/test'

const themes = ['adminlte', 'empty', 'tabler', 'tailwind']

for (const profile of ['development', 'production']) {
    for (const theme of themes) {
        test(`${profile} ${theme} uses the shared desktop shell geometry`, async ({ page }) => {
            await page.setViewportSize({ width: 1280, height: 800 })
            await page.goto(`/shared-shell?profile=${profile}&theme=${theme}`)

            await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
            await expect(page.locator('.soa-app')).toHaveCSS('display', 'grid')
            await expect(page.locator('.nav-sidebar')).toHaveCSS('padding-left', '0px')
            await expect(page.locator('#header-action')).toHaveCSS('min-width', '40px')
            await expect(page.locator('#header-action')).toHaveCSS('min-height', '40px')
            await expect(page.locator('#scrolltobottom')).toHaveCSS('text-decoration-line', 'none')

            const geometry = await shellGeometry(page)
            expect(geometry.header).toMatchObject({ height: 56, left: 256, width: 1024 })
            expect(geometry.sidebar).toMatchObject({ left: 0, width: 256 })
            expect(geometry.main).toMatchObject({ left: 256, width: 1024 })
            expect(geometry.footer).toMatchObject({ left: 256, width: 1024 })
            expect(geometry.sidebar.height).toBeGreaterThanOrEqual(geometry.viewport.height)

            await expectDesktopScrollControls(page)
            await expectFixedControlsAvoidContent(page, 16)

            await page.locator('body').evaluate((body) => body.classList.add('sidebar-collapse'))
            await page.locator('.soa-main').hover()
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

    for (const theme of themes) {
        test(`${profile} ${theme} expands its managed collapsed rail without moving content`, async ({
            page,
        }) => {
            await page.setViewportSize({ width: 1100, height: 800 })
            await page.goto(`/shared-shell?profile=${profile}&theme=${theme}`)
            await page.locator('body').evaluate((body) => body.classList.add('sidebar-collapse'))
            await page.locator('.soa-main').hover()

            const collapsed = await expectManagedCollapsedSidebar(page)

            await page.locator('#shell-sidebar').hover()
            const flyout = await expectManagedSidebarFlyout(page)

            expect(flyout.geometry.main).toEqual(collapsed.geometry.main)
            expect(flyout.geometry.footer).toEqual(collapsed.geometry.footer)
            expect(flyout.geometry.header).toEqual(collapsed.geometry.header)
            expect(flyout.arrowLeft).toBeCloseTo(collapsed.arrowLeft, 0)
            expect(flyout.brandCenter).toBeCloseTo(collapsed.brandCenter, 0)
        })
    }
}

test('shared shell focus and reduced motion contracts are theme neutral', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/shared-shell?profile=development&theme=empty')

    await page.keyboard.press('Tab')
    await expect(page.locator('#header-action')).toBeFocused()
    await expect(page.locator('#header-action')).toHaveCSS('outline-style', 'solid')
    await expect(page.locator('.soa-app')).toHaveCSS('transition-duration', '0s')
    await expect(page.locator('#scrolltobottom')).toHaveCSS('transition-duration', '0s')
})

for (const profile of ['development', 'production']) {
    test(`${profile} empty theme gets shared light and dark foundations`, async ({ page }) => {
        await page.goto(`/shared-shell?profile=${profile}&theme=empty&color-scheme=light`)

        expect(await shellPalette(page)).toEqual({
            bodyBackground: 'rgb(249, 250, 251)',
            bodyColor: 'rgb(31, 41, 55)',
            bodyFontSize: '16px',
            colorScheme: 'light',
            footerBackground: 'rgb(255, 255, 255)',
            headerBackground: 'rgb(255, 255, 255)',
            sidebarBackground: 'rgb(52, 58, 64)',
        })

        await page.goto(`/shared-shell?profile=${profile}&theme=empty&color-scheme=dark`)

        expect(await shellPalette(page)).toEqual({
            bodyBackground: 'rgb(17, 24, 39)',
            bodyColor: 'rgb(243, 244, 246)',
            bodyFontSize: '16px',
            colorScheme: 'dark',
            footerBackground: 'rgb(31, 41, 55)',
            headerBackground: 'rgb(39, 52, 73)',
            sidebarBackground: 'rgb(15, 23, 42)',
        })
    })
}

function shellPalette(page) {
    return page.evaluate(() => {
        const style = (selector) => getComputedStyle(document.querySelector(selector))
        const body = style('body')

        return {
            bodyBackground: body.backgroundColor,
            bodyColor: body.color,
            bodyFontSize: body.fontSize,
            colorScheme: getComputedStyle(document.documentElement).colorScheme,
            footerBackground: style('.soa-footer').backgroundColor,
            headerBackground: style('.soa-header').backgroundColor,
            sidebarBackground: style('.soa-sidebar').backgroundColor,
        }
    })
}

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

async function expectSidebarTransition(page) {
    const transition = await page.locator('#shell-sidebar').evaluate((element) => {
        const style = getComputedStyle(element)

        return {
            duration: Number.parseFloat(style.transitionDuration),
            property: style.transitionProperty,
        }
    })
    const contentDuration = await page
        .locator('.soa-nav-link-content')
        .evaluate((element) => Number.parseFloat(getComputedStyle(element).transitionDuration))

    expect(transition.duration).toBeGreaterThan(0)
    expect(transition.property).toContain('inline-size')
    expect(contentDuration).toBe(transition.duration)
}

async function expectManagedCollapsedSidebar(page) {
    await expect(page.locator('#shell-sidebar')).toHaveCSS('transform', 'none')
    await expect(page.locator('#shell-sidebar')).toHaveCSS('width', '64px')
    await expect(page.locator('#sidebar-overlay')).toHaveCSS('display', 'none')
    await expect(page.locator('.soa-nav-link-content')).toHaveCSS('opacity', '0')
    await expectSidebarTransition(page)
    const geometry = await shellGeometry(page)
    const arrowLeft = await elementLeft(page, '.soa-nav-arrow')
    const sidebarCenter = await elementCenter(page, '#shell-sidebar')
    const brandCenter = await elementCenter(page, '.soa-brand-mini')
    expect(geometry.sidebar.left).toBe(0)
    expect(brandCenter).toBeCloseTo(sidebarCenter, 0)

    return { arrowLeft, brandCenter, geometry }
}

async function expectManagedSidebarFlyout(page) {
    await expect(page.locator('#shell-sidebar')).toHaveCSS('width', '256px')
    await expect(page.locator('.soa-brand-logo')).toBeHidden()
    await expect(page.locator('.soa-brand-mini')).toBeVisible()
    await expect(page.locator('.soa-brand-text')).toBeVisible()
    await expect(page.locator('.soa-nav-link-content')).toHaveCSS('display', 'flex')
    await expect(page.locator('.soa-nav-link-content')).toHaveCSS('opacity', '1')

    return {
        arrowLeft: await elementLeft(page, '.soa-nav-arrow'),
        brandCenter: await elementCenter(page, '.soa-brand-mini'),
        geometry: await shellGeometry(page),
    }
}

async function elementLeft(page, selector) {
    return page.locator(selector).evaluate((element) => element.getBoundingClientRect().left)
}

async function elementCenter(page, selector) {
    return page.locator(selector).evaluate((element) => {
        const rectangle = element.getBoundingClientRect()

        return rectangle.left + rectangle.width / 2
    })
}
