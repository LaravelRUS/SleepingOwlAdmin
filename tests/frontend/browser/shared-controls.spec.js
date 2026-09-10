import { expect, test } from '@playwright/test'

/* global document, getComputedStyle */

const themes = ['adminlte', 'empty', 'shadcn', 'tabler']

for (const profile of ['development', 'production']) {
    for (const theme of themes) {
        test(`${profile} ${theme} uses shared control and container geometry`, async ({ page }) => {
            await page.setViewportSize({ width: 1280, height: 800 })
            await page.goto(`/shared-controls?profile=${profile}&theme=${theme}`)

            await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
            await expect(page.locator('#button-toolbar')).toHaveCSS('display', 'flex')
            await expect(page.locator('#input-group')).toHaveCSS('display', 'flex')
            await expect(page.locator('#collapsed-card .soa-card-body')).toBeHidden()
            await expect(page.locator('#collapsed-card .soa-card-footer')).toBeHidden()

            await expectSharedSizes(page)
            await expectSharedStates(page)
            await expectViewportContainers(page)
        })
    }
}

async function expectSharedSizes(page) {
    const sizes = await page.evaluate(() => {
        const size = (selector) => {
            const { height, width } = document.querySelector(selector).getBoundingClientRect()

            return { height, width }
        }

        return {
            button: size('#primary-button'),
            checkbox: size('#checked-choice'),
            icon: size('#icon-button'),
            input: size('#text-input'),
            smallButton: size('#small-button'),
            switchTrack: size('.soa-switch-track'),
            textarea: size('#textarea-input'),
        }
    })

    expect(sizes.button.height).toBe(38)
    expect(sizes.smallButton.height).toBe(32)
    expect(sizes.icon).toMatchObject({ height: 36, width: 36 })
    expect(sizes.input.height).toBe(38)
    expect(sizes.textarea.height).toBe(112)
    expect(sizes.checkbox).toMatchObject({ height: 16, width: 16 })
    expect(sizes.switchTrack).toMatchObject({ height: 22, width: 40 })
}

async function expectSharedStates(page) {
    const states = await page.evaluate(() => {
        const style = (selector) => getComputedStyle(document.querySelector(selector))
        const probe = document.createElement('span')
        probe.style.color = 'var(--soa-danger-color)'
        document.querySelector('#error-upload').append(probe)
        const errorColor = getComputedStyle(probe).color
        probe.remove()

        return {
            disabledOpacity: Number(style('#disabled-button').opacity),
            emptyHeight: document.querySelector('#empty-upload').getBoundingClientRect().height,
            errorBorder: style('#error-upload .soa-attachment-list').borderColor,
            errorColor,
            indeterminate: document.querySelector('#indeterminate-choice').indeterminate,
            readonlyOpacity: Number(style('#readonly-choice').opacity),
            uploadingPointerEvents: style('#uploading-file [data-file-upload]').pointerEvents,
        }
    })

    expect(states.disabledOpacity).toBeLessThan(1)
    expect(states.readonlyOpacity).toBeLessThan(1)
    expect(states.emptyHeight).toBeGreaterThanOrEqual(80)
    expect(states.errorBorder).toBe(states.errorColor)
    expect(states.indeterminate).toBe(true)
    expect(states.uploadingPointerEvents).toBe('none')

    await page.keyboard.press('Tab')
    await expect(page.locator('#primary-button')).toBeFocused()
    await expect(page.locator('#primary-button')).toHaveCSS('outline-style', 'solid')
}

async function expectViewportContainers(page) {
    await expect(page.locator('#fixture-dialog')).toHaveCSS('width', '1024px')
    await expect(page.locator('#fixture-dialog')).toHaveCSS('max-height', '768px')

    await page
        .locator('#controls-card')
        .evaluate((card) => card.classList.add('soa-card-maximized'))
    const maximized = await page.locator('#controls-card').boundingBox()
    expect(maximized).toMatchObject({ height: 800, width: 1280, x: 0, y: 0 })
    await page
        .locator('#controls-card')
        .evaluate((card) => card.classList.remove('soa-card-maximized'))

    await page.setViewportSize({ width: 390, height: 800 })
    await expect(page.locator('#fixture-dialog')).toHaveCSS('width', '358px')
}
