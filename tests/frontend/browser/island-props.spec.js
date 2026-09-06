import { expect, test } from '@playwright/test'

test('typed data and JSON props work in a real browser module', async ({ page }) => {
    const pageErrors = []
    page.on('pageerror', (error) => pageErrors.push(error.message))

    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-ready', 'true')

    const result = JSON.parse(await page.locator('#result').textContent())
    expect(result).toEqual({
        dataset: { enabled: false, limit: 25, name: 'orders' },
        payload: { filters: ['active'], page: 2 },
    })
    expect(pageErrors).toEqual([])
})

test('application/json island props stay inert and readable without a CSP nonce', async ({
    page,
}) => {
    await page.goto('/island-props-csp')

    const result = await page.locator('#island-csp-payload').evaluate((script) => ({
        executed: Boolean(globalThis.__islandPayloadExecuted),
        nonce: script.nonce,
        value: JSON.parse(script.textContent).value,
    }))

    expect(result).toEqual({
        executed: false,
        nonce: '',
        value: '<script>globalThis.__islandPayloadExecuted = true</script>',
    })
})
