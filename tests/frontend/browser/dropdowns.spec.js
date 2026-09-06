import { expect, test } from '@playwright/test'

test('opens and closes native markup with ARIA and lifecycle events', async ({ page }) => {
    await page.goto('/dropdowns')
    const toggle = page.locator('#native-toggle')
    const menu = page.locator('#native-menu')

    await expect(menu).toBeHidden()
    await toggle.click()
    await expect(menu).toBeVisible()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(page.locator('#native-root')).toHaveClass(/\bshow\b/)
    await expect(page.locator('#native-root')).toHaveClass(/\bopen\b/)

    await page.mouse.click(1000, 600)
    await expect(menu).toBeHidden()
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(await page.evaluate(() => globalThis.__dropdownEvents)).toEqual([
        { id: 'native-toggle', name: 'dropdown:show' },
        { id: 'native-toggle', name: 'dropdown:shown' },
        { id: 'native-toggle', name: 'dropdown:hide' },
        { id: 'native-toggle', name: 'dropdown:hidden' },
    ])
})

test('uses keyboard navigation, skips disabled items and restores focus on Escape', async ({
    page,
}) => {
    await page.goto('/dropdowns')
    await page.locator('#native-toggle').focus()
    await page.keyboard.press('ArrowDown')
    await expect(page.locator('#first-action')).toBeFocused()

    await page.keyboard.press('ArrowUp')
    await expect(page.locator('#second-action')).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(page.locator('#native-toggle')).toBeFocused()
    await expect(page.locator('#native-menu')).toBeHidden()
})

test('keeps form controls open and closes after an action', async ({ page }) => {
    await page.goto('/dropdowns')
    await page.locator('#native-toggle').click()
    await page.locator('#menu-filter').fill('active')
    await expect(page.locator('#native-menu')).toBeVisible()

    await page.locator('#second-action').click()
    await expect(page.locator('#native-menu')).toBeHidden()
})

test('keeps one menu open and honors cancelable lifecycle events', async ({ page }) => {
    await page.goto('/dropdowns')
    await page.locator('#native-toggle').click()
    await page.locator('#legacy-toggle').press('Enter')

    await expect(page.locator('#native-menu')).toBeHidden()
    await expect(page.locator('#legacy-menu')).toBeVisible()
    expect(await page.evaluate(() => globalThis.__jqueryDropdownEvents)).toBe(0)

    await page.evaluate(() => {
        globalThis.document
            .querySelector('#native-toggle')
            .addEventListener('dropdown:show', (event) => event.preventDefault(), { once: true })
    })
    await page.locator('#native-toggle').click()
    await expect(page.locator('#native-menu')).toBeHidden()
    await expect(page.locator('#legacy-menu')).toBeHidden()
})

test('handles dynamically inserted legacy markup without Bootstrap dropdown execution', async ({
    page,
}) => {
    await page.goto('/dropdowns')
    await page.evaluate(() => {
        globalThis.document.querySelector('#dynamic-host').innerHTML = `
            <div class="dropdown" id="dynamic-root">
                <button id="dynamic-toggle" data-toggle="dropdown" aria-controls="dynamic-menu">Dynamic</button>
                <div class="dropdown-menu" id="dynamic-menu"><a href="#dynamic">Dynamic action</a></div>
            </div>`
    })

    await page.locator('#dynamic-toggle').click()
    await expect(page.locator('#dynamic-menu')).toBeVisible()
    expect(await page.evaluate(() => globalThis.__jqueryDropdownEvents)).toBe(0)
})

test('precompiled feature entry boots on the headless core without jQuery', async ({ page }) => {
    await page.goto('/dropdowns-modern')
    expect(await page.evaluate(() => globalThis.jQuery)).toBeUndefined()

    await page.locator('#modern-toggle').click()
    await expect(page.locator('#modern-menu')).toBeVisible()
    await page.locator('#modern-action').click()
    await expect(page.locator('#modern-menu')).toBeHidden()
})
