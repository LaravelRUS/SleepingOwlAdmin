import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.goto('/lightboxes')
})

test('native and legacy markers open GLightbox with scoped gallery navigation', async ({
    page,
}) => {
    await page.locator('#gallery-second').click()

    await expect(page.locator('.glightbox-container')).toBeVisible()
    await expect(page.locator('.gslide.current img')).toHaveAttribute('alt', 'Second preview')
    await page.locator('.gprev').click()
    await expect(page.locator('.gslide.current img')).toHaveAttribute('alt', 'First preview')
    await page.keyboard.press('Escape')
    await expect(page.locator('.glightbox-container')).toHaveCount(0)

    expect(await page.evaluate(() => globalThis.__lightboxEvents)).toEqual([
        { id: 'gallery-second', name: 'lightbox:opened', size: 2 },
        { id: 'gallery-second', name: 'lightbox:closed', size: 2 },
    ])
})

test('delegated controller opens a dynamically inserted image without rescanning', async ({
    page,
}) => {
    await page.evaluate(() => {
        const link = globalThis.document.createElement('a')
        link.id = 'dynamic-lightbox'
        link.href = '/fixtures/pixel.svg?slide=dynamic'
        link.dataset.lightbox = ''
        link.innerHTML = '<img src="/fixtures/pixel.svg" alt="Dynamic preview">'
        globalThis.document.querySelector('main').append(link)
    })

    await page.locator('#dynamic-lightbox').click()
    await expect(page.locator('.gslide.current img')).toHaveAttribute('alt', 'Dynamic preview')
    await page.keyboard.press('Escape')
})

test('caption content remains text instead of executable HTML', async ({ page }) => {
    await page.locator('#single').click()

    await expect(page.locator('.gslide.current .gslide-title')).toHaveText(
        '<img src=x onerror=alert(1)>',
    )
    await expect(page.locator('.gslide.current .gslide-title img')).toHaveCount(0)
    await page.keyboard.press('Escape')
})

test('modified clicks keep the native link behavior available', async ({ page }) => {
    await page.locator('#single').dispatchEvent('click', { ctrlKey: true })

    await expect(page.locator('.glightbox-container')).toHaveCount(0)
    expect(await page.evaluate(() => globalThis.__lightboxEvents)).toEqual([])
})

test('component lifecycle removes and restores the delegated controller', async ({ page }) => {
    const destroyed = await page.evaluate(() => {
        return globalThis.Admin.Components.destroy(globalThis.document.body, 'lightbox')
    })
    expect(destroyed).toBe(1)

    await page.locator('#single').evaluate((link) => {
        globalThis.addEventListener('click', (event) => event.preventDefault(), { once: true })
        const event = new globalThis.MouseEvent('click', {
            bubbles: true,
            button: 0,
            cancelable: true,
        })
        link.dispatchEvent(event)
    })
    await expect(page.locator('.glightbox-container')).toHaveCount(0)

    const mounted = await page.evaluate(() => {
        return globalThis.Admin.Components.scan(globalThis.document, 'lightbox')
    })
    expect(mounted).toBe(1)
    await page.locator('#single').click()
    await expect(page.locator('.glightbox-container')).toBeVisible()
})
