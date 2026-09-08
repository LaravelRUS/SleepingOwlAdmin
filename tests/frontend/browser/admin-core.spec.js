import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.goto('/admin-core')
    await expect(page.locator('html')).toHaveAttribute('data-ready', 'true')
})

test('production core exposes real services without framework globals', async ({ page }) => {
    const state = await page.evaluate(() => ({
        events: globalThis.__coreEvents,
        forbidden: {
            $: typeof globalThis.$,
            DataTable: typeof globalThis.DataTable,
            Vue: typeof globalThis.Vue,
            jQuery: typeof globalThis.jQuery,
        },
        mounts: globalThis.__coreMounts,
        services: Object.keys(globalThis.Admin).sort(),
        stored: globalThis.localStorage.getItem('SleepingOwl::fixture'),
    }))

    expect(state).toEqual({
        events: ['ready'],
        forbidden: {
            $: 'undefined',
            DataTable: 'undefined',
            Vue: 'undefined',
            jQuery: 'undefined',
        },
        mounts: 1,
        services: [
            'Asset',
            'Components',
            'DOM',
            'Data',
            'Events',
            'Http',
            'Storage',
            'Tables',
        ].sort(),
        stored: 'stored',
    })
    await expect(page.locator('#component')).toHaveAttribute('data-core-mounted', 'true')

    expect(
        await page.evaluate(() => globalThis.Admin.Components.destroy(globalThis.document)),
    ).toBe(1)
    await expect(page.locator('#component')).not.toHaveAttribute('data-core-mounted', 'true')
})

test('production HTTP service sends native CSRF requests', async ({ page }) => {
    let request
    await page.route('**/api/core', async (route) => {
        request = route.request()
        await route.fulfill({ json: { accepted: true } })
    })

    const result = await page.evaluate(async () => {
        const response = await globalThis.Admin.Http.post('/api/core', 'payload', {
            headers: { 'Content-Type': 'text/plain' },
        })

        return response.json()
    })

    expect(result).toEqual({ accepted: true })
    expect(request.method()).toBe('POST')
    expect(request.postData()).toBe('payload')
    expect(await request.allHeaders()).toMatchObject({
        'x-csrf-token': 'browser-csrf-token',
        'x-requested-with': 'XMLHttpRequest',
    })
})

test('production core disables animation tokens for reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.reload()

    await expect(page.locator('html')).toHaveCSS('--soa-motion-duration-fast', '0ms')
    await expect(page.locator('html')).toHaveCSS('--soa-motion-duration-normal', '0ms')
})
