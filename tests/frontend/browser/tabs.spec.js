import { expect, test } from '@playwright/test'

test('restores and persists legacy tab state through the native controller', async ({ page }) => {
    await page.addInitScript(() => {
        globalThis.localStorage.setItem(
            'Tabbed_/tabs',
            JSON.stringify({ 0: 'details-panel', 1: 'first-keyboard-panel' }),
        )
    })
    await page.goto('/tabs')

    await expect(page.locator('#details-tab')).toHaveAttribute('aria-selected', 'true')
    await expect(page.locator('#details-panel')).toBeVisible()
    await expect(page.locator('#overview-panel')).toBeHidden()

    await page.locator('#overview-tab').click()
    await expect(page.locator('#overview-panel')).toBeVisible()
    await expect
        .poll(() =>
            page.evaluate(() => JSON.parse(globalThis.localStorage.getItem('Tabbed_/tabs'))),
        )
        .toEqual({ 0: 'overview-panel', 1: 'first-keyboard-panel' })
    expect(await page.evaluate(() => globalThis.__jqueryTabEvents)).toBe(0)
})

test('publishes native and compatibility events without Bootstrap tab execution', async ({
    page,
}) => {
    await page.goto('/tabs')
    await page.locator('#details-tab').click()

    expect(await page.evaluate(() => globalThis.__tabEvents)).toEqual([
        { id: 'overview-tab', name: 'tab:hidden' },
        { id: 'details-tab', name: 'tab:shown' },
    ])
    expect(await page.evaluate(() => globalThis.__bootstrapTabEvents)).toEqual([
        { id: 'overview-panel', name: 'bootstrap::tab::hidden' },
        { id: 'details-panel', name: 'bootstrap::tab::shown' },
    ])
    expect(await page.evaluate(() => globalThis.__jqueryTabEvents)).toBe(0)
})

test('keyboard navigation skips disabled tabs and wraps inside its tablist', async ({ page }) => {
    await page.goto('/tabs')
    await page.locator('#first-keyboard-tab').focus()
    await page.keyboard.press('ArrowLeft')

    await expect(page.locator('#last-keyboard-tab')).toBeFocused()
    await expect(page.locator('#last-keyboard-tab')).toHaveAttribute('aria-selected', 'true')
    await expect(page.locator('#last-keyboard-panel')).toBeVisible()
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('#first-keyboard-tab')).toBeFocused()
})

test('delegated controller activates a dynamically inserted tablist', async ({ page }) => {
    await page.goto('/tabs')
    await page.evaluate(() => {
        globalThis.document
            .querySelector('main')
            .insertAdjacentHTML(
                'beforeend',
                '<div role="tablist"><button data-soa-tab id="dynamic-tab" aria-controls="dynamic-panel">Dynamic</button></div><section id="dynamic-panel" hidden>Dynamic panel</section>',
            )
    })

    await page.locator('#dynamic-tab').click()
    await expect(page.locator('#dynamic-panel')).toBeVisible()
})

test('precompiled feature entry boots on the headless core without jQuery', async ({ page }) => {
    await page.goto('/tabs-modern')
    expect(await page.evaluate(() => globalThis.jQuery)).toBeUndefined()

    await expect(page.locator('#modern-second-panel')).toBeHidden()
    await page.locator('#modern-second-tab').click()
    await expect(page.locator('#modern-second-panel')).toBeVisible()
    await expect(page.locator('#modern-first-panel')).toBeHidden()
})
