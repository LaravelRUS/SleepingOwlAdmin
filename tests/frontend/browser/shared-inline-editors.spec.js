import { expect, test } from '@playwright/test'

/* global document, getComputedStyle */

const themes = ['adminlte', 'empty', 'shadcn']

for (const profile of ['development', 'production']) {
    for (const theme of themes) {
        test(`${profile} ${theme} uses shared inline editor geometry`, async ({ page }) => {
            await page.setViewportSize({ width: 1280, height: 800 })
            await page.goto(`/shared-inline-editors?profile=${profile}&theme=${theme}`)

            await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
            await expectEditorGeometry(page, 480)
            await expectEditorStates(page)

            await page.setViewportSize({ width: 390, height: 800 })
            await expectEditorGeometry(page, 358)
        })
    }
}

async function expectEditorGeometry(page, popupWidth) {
    const geometry = await page.evaluate(() => {
        const rectangle = (selector) => {
            const { height, width } = document.querySelector(selector).getBoundingClientRect()

            return { height, width }
        }
        const style = (selector) => getComputedStyle(document.querySelector(selector))

        return {
            actionsDisplay: style('#editor-actions').display,
            checkbox: rectangle('#checkbox-control'),
            clear: rectangle('#text-clear'),
            controlHeights: [
                '#text-control',
                '#number-control',
                '#date-control',
                '#datetime-control',
                '#select-control',
                '#range-number',
            ].map((selector) => rectangle(selector).height),
            editorMinWidth: Number.parseFloat(style('#text-editor').minWidth),
            popup: rectangle('#popup-editor'),
            rangeNumber: rectangle('.soa-inline-editor-range-number-wrap'),
            selectClear: rectangle('#select-clear'),
            selectControl: rectangle('#select-control'),
            textarea: rectangle('#textarea-control'),
        }
    })

    expect(geometry.editorMinWidth).toBe(224)
    expect(geometry.popup.width).toBe(popupWidth)
    expect(geometry.controlHeights).toEqual([38, 38, 38, 38, 38, 38])
    expect(geometry.textarea.height).toBe(112)
    expect(geometry.checkbox).toMatchObject({ height: 16, width: 16 })
    expect(geometry.clear).toMatchObject({ height: 32, width: 32 })
    expect(geometry.selectClear).toMatchObject({ height: 32, width: 32 })
    expect(geometry.selectControl.width).toBeGreaterThan(0)
    expect(geometry.rangeNumber.width).toBe(128)
    expect(geometry.actionsDisplay).toBe('flex')
}

async function expectEditorStates(page) {
    const states = await page.evaluate(() => {
        const style = (selector) => getComputedStyle(document.querySelector(selector))
        const checklist = document.querySelector('#checklist-control')

        return {
            busyFormOpacity: Number(style('#busy-editor form').opacity),
            busyTriggerOpacity: Number(style('#busy-trigger').opacity),
            checklistScrollable: checklist.scrollHeight > checklist.clientHeight,
            checklistOverflow: style('#checklist-control').overflowY,
            closedPopupDisplay: style('#closed-popup').display,
            clamp: style('#clamped-trigger').webkitLineClamp,
            clampOverflow: style('#clamped-trigger').overflow,
            errorVisible:
                document.querySelector('#editor-error').getBoundingClientRect().height > 0,
            rangeOutputDisplay: style('#range-output').display,
        }
    })

    expect(states.busyFormOpacity).toBeLessThan(1)
    expect(states.busyTriggerOpacity).toBeLessThan(1)
    expect(states.checklistScrollable).toBe(true)
    expect(states.checklistOverflow).toBe('auto')
    expect(states.closedPopupDisplay).toBe('none')
    expect(states.clamp).toBe('2')
    expect(states.clampOverflow).toBe('hidden')
    expect(states.errorVisible).toBe(true)
    expect(states.rangeOutputDisplay).not.toBe('none')

    await page.keyboard.press('Tab')
    await expect(page.locator('#clamped-trigger')).toBeFocused()
    await expect(page.locator('#clamped-trigger')).toHaveCSS('outline-style', 'solid')
}
