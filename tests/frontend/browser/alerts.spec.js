import { expect, test } from '@playwright/test'

test('closes legacy flash markup and publishes native compatibility events', async ({ page }) => {
    await page.goto('/alerts')
    await page.locator('#static-close').click()

    await expect(page.locator('#static-alert')).toHaveCount(0)
    expect(await page.evaluate(() => globalThis.__alertEvents.slice(0, 4))).toEqual([
        { id: 'static-alert', name: 'alert:close' },
        { id: 'static-alert', name: 'close.bs.alert' },
        { id: 'static-alert', name: 'alert:closed' },
        { id: 'static-alert', name: 'closed.bs.alert' },
    ])
})

test('honors cancellation and resolves explicit legacy targets', async ({ page }) => {
    await page.goto('/alerts')
    await page.locator('#protected-close').click()
    await expect(page.locator('#protected-alert')).toBeVisible()

    await page.locator('#target-close').click()
    await expect(page.locator('#target-alert')).toHaveCount(0)
})

test('delegation closes dynamically inserted alerts without rescanning', async ({ page }) => {
    await page.goto('/alerts')
    await page.evaluate(() => {
        globalThis.document.querySelector('#dynamic-host').innerHTML = `
            <div id="dynamic-alert" class="alert show" role="alert">
                Dynamic
                <button id="dynamic-close" data-dismiss="alert">Close</button>
            </div>`
    })

    await page.locator('#dynamic-close').click()
    await expect(page.locator('#dynamic-alert')).toHaveCount(0)
})

test('precompiled alert entry boots on the headless core without jQuery', async ({ page }) => {
    await page.goto('/alerts-modern')
    expect(await page.evaluate(() => globalThis.jQuery)).toBeUndefined()

    await page.locator('#modern-close').click()
    await expect(page.locator('#modern-alert')).toHaveCount(0)
})
