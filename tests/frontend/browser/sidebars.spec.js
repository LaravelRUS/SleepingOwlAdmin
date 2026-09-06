import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.goto('/sidebars')
    await page.evaluate(() => {
        globalThis.localStorage.removeItem('sidebar-state')
        globalThis.document.cookie = 'sidebar-state=; Max-Age=0; Path=/'
    })
    await page.reload()
})

test('keeps legacy markers while native state persists without AdminLTE execution', async ({
    page,
}) => {
    const toggle = page.locator('#pushmenu')
    await expect(toggle).toHaveAttribute('data-widget', 'pushmenu')
    await toggle.click()

    await expect(page.locator('body')).toHaveClass(/\bsidebar-collapse\b/)
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(await page.evaluate(() => globalThis.localStorage.getItem('sidebar-state'))).toBe(
        'sidebar-collapse',
    )
    expect(await page.evaluate(() => globalThis.jQuery)).toBeUndefined()
    expect(await page.evaluate(() => globalThis.__sidebarEvents.slice(0, 2))).toEqual([
        'sidebar:collapsed',
        'collapsed.lte.pushmenu',
    ])

    await page.reload()
    await expect(page.locator('body')).toHaveClass(/\bsidebar-collapse\b/)
})

test('tree navigation owns ARIA, keyboard and non-accordion branches', async ({ page }) => {
    const first = page.locator('#first-link')
    const second = page.locator('#second-link')
    await expect(page.locator('#navigation')).toHaveAttribute('data-widget', 'treeview')
    await expect(page.locator('#first-menu')).toBeHidden()

    await first.focus()
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('#first-menu')).toBeVisible()
    await expect(first).toHaveAttribute('aria-expanded', 'true')
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('#first-child')).toBeFocused()

    await second.click()
    await expect(page.locator('#first-menu')).toBeVisible()
    await expect(page.locator('#second-menu')).toBeVisible()
    await second.press(' ')
    await expect(page.locator('#second-menu')).toBeHidden()
    expect(await page.evaluate(() => globalThis.__sidebarEvents)).toEqual([
        'navigation:expanded',
        'navigation:expanded',
        'navigation:collapsed',
    ])
})

test('compact navigation uses the overlay and Escape without replacing markers', async ({
    page,
}) => {
    await page.setViewportSize({ width: 800, height: 700 })
    await page.reload()
    await expect(page.locator('body')).toHaveClass(/\bsidebar-collapse\b/)
    expect(await page.evaluate(() => globalThis.localStorage.getItem('sidebar-state'))).toBeNull()

    await page.locator('#pushmenu').click()
    await expect(page.locator('body')).toHaveClass(/\bsidebar-open\b/)
    await expect(page.locator('#sidebar-overlay')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.locator('#sidebar-overlay')).toBeHidden()
    await expect(page.locator('#pushmenu')).toBeFocused()
})

test('delegated navigation normalizes and opens a dynamically inserted legacy tree', async ({
    page,
}) => {
    await page.evaluate(() => {
        const host = globalThis.document.querySelector('#dynamic-navigation')
        host.innerHTML = `
            <ul id="dynamic-tree" class="nav-sidebar" data-widget="treeview">
                <li id="dynamic-branch" class="nav-item">
                    <a id="dynamic-link" class="nav-link" href="#dynamic">Dynamic</a>
                    <ul id="dynamic-menu" class="nav-treeview">
                        <li class="nav-item"><a class="nav-link" href="#dynamic-child">Child</a></li>
                    </ul>
                </li>
            </ul>`
        globalThis.Admin.Sidebar.scan(host)
    })

    await expect(page.locator('#dynamic-menu')).toBeHidden()
    await page.locator('#dynamic-link').click()
    await expect(page.locator('#dynamic-menu')).toBeVisible()
    await expect(page.locator('#dynamic-link')).toHaveAttribute('aria-expanded', 'true')
})

test('precompiled sidebar feature boots on the headless core without jQuery', async ({ page }) => {
    await page.goto('/sidebars-modern')
    expect(await page.evaluate(() => globalThis.jQuery)).toBeUndefined()
    await page.locator('#modern-link').click()
    await expect(page.locator('#modern-menu')).toBeVisible()
    await page.locator('#modern-pushmenu').click()
    await expect(page.locator('body')).toHaveClass(/\bsidebar-collapse\b/)
})
