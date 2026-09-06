import { expect, test } from '@playwright/test'

test('shows escaped tooltip content on hover and restores the native title', async ({ page }) => {
    await page.goto('/tooltips')
    const trigger = page.locator('#native-tooltip')

    await trigger.hover()
    const tooltip = page.locator('[role="tooltip"]')
    await expect(tooltip).toHaveText('Native tooltip')
    await expect(trigger).not.toHaveAttribute('title')
    await expect(trigger).toHaveAttribute('aria-describedby', await tooltip.getAttribute('id'))

    await page.mouse.move(0, 0)
    await expect(tooltip).toHaveCount(0)
    await expect(trigger).toHaveAttribute('title', 'Native tooltip')
})

test('supports keyboard focus and Escape without jQuery', async ({ page }) => {
    await page.goto('/tooltips')
    const trigger = page.locator('#focus-tooltip')

    await trigger.focus()
    await expect(page.locator('[role="tooltip"]')).toHaveText('Keyboard tooltip')
    await page.keyboard.press('Escape')

    await expect(page.locator('[role="tooltip"]')).toHaveCount(0)
    await expect(trigger).toBeFocused()
    expect(await page.evaluate(() => globalThis.jQuery)).toBeUndefined()
})

test('delegation supports compatibility markers inserted after boot', async ({ page }) => {
    await page.goto('/tooltips')
    await page.evaluate(() => {
        globalThis.document
            .querySelector('main')
            .insertAdjacentHTML(
                'beforeend',
                '<button id="dynamic-tooltip" data-toggle="tooltip" title="&lt;img src=x onerror=alert(1)&gt;">Dynamic</button>',
            )
    })

    await page.locator('#dynamic-tooltip').hover()
    const tooltip = page.locator('[role="tooltip"]')
    await expect(tooltip).toHaveText('<img src=x onerror=alert(1)>')
    expect(await tooltip.locator('img').count()).toBe(0)
})
