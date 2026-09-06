import { expect, test } from '@playwright/test'

function capturePageErrors(page) {
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    return errors
}

async function openFixture(page) {
    await page.goto('/native-controls')
    await expect(page.locator('#control-table')).toBeVisible()
}

test('Admin.Asset loads, deduplicates and registers native resources', async ({ page }) => {
    const pageErrors = capturePageErrors(page)
    await openFixture(page)

    const state = await page.evaluate(async () => {
        const first = globalThis.Admin.Asset.js('/fixtures/runtime.js')
        const concurrent = globalThis.Admin.Asset.js('/fixtures/runtime.js')
        const samePromise = first === concurrent
        await first
        await globalThis.Admin.Asset.js('/fixtures/runtime.js')
        await globalThis.Admin.Asset.css('/fixtures/runtime.css')
        await globalThis.Admin.Asset.css('/fixtures/runtime-second.css')
        await globalThis.Admin.Asset.css('/fixtures/runtime-second.css')
        const image = await globalThis.Admin.Asset.img('/fixtures/pixel.svg')
        const registered = await globalThis.Admin.Asset.register({
            css: '/fixtures/registered.css',
            js: '/fixtures/registered.js',
        })

        return {
            image,
            links: globalThis.document.querySelectorAll('link[href^="/fixtures/"]').length,
            loadedScripts: globalThis.__runtimeAssetLoads,
            registered,
            samePromise,
            scripts: globalThis.document.querySelectorAll('script[src^="/fixtures/"]').length,
        }
    })

    expect(state).toEqual({
        image: '/fixtures/pixel.svg',
        links: 3,
        loadedScripts: ['/fixtures/runtime.js', '/fixtures/registered.js'],
        registered: ['/fixtures/registered.css', '/fixtures/registered.js'],
        samePromise: true,
        scripts: 2,
    })
    expect(pageErrors).toEqual([])
})

test('row and select-all checkboxes work for dynamically inserted rows', async ({ page }) => {
    await openFixture(page)
    await page.locator('#row-one-checkbox').check()
    await expect(page.locator('#row-one')).toHaveClass(/info/)
    await expect(page.locator('#row-one')).toHaveAttribute('data-soa-selected', '')
    await expect(page.locator('#row-one')).toHaveAttribute('aria-selected', 'true')

    await page.locator('#control-table tbody').evaluate((body) => {
        body.insertAdjacentHTML(
            'beforeend',
            '<tr id="row-three"><td><input class="adminCheckboxRow" id="row-three-checkbox" type="checkbox" value="3"></td><td></td></tr>',
        )
    })
    await page.locator('#row-three-checkbox').check()
    await expect(page.locator('#row-three')).toHaveClass(/info/)

    await page.locator('#select-all').check()
    await expect(page.locator('.adminCheckboxRow:checked')).toHaveCount(3)
    await page.locator('#select-all').uncheck()
    await expect(page.locator('.adminCheckboxRow:checked')).toHaveCount(0)
    await expect(page.locator('#row-three')).not.toHaveClass(/info/)
    await expect(page.locator('#row-three')).toHaveAttribute('aria-selected', 'false')
})

test('table and tree controls submit native forms with scoped selectors', async ({ page }) => {
    const pageErrors = capturePageErrors(page)
    await openFixture(page)

    await page.locator('#table-delete').click()
    await expect.poll(() => submissionCount(page)).toBe(1)
    await page.locator('#tree-destroy').click()
    await expect.poll(() => submissionCount(page)).toBe(2)

    const state = await page.evaluate(() => ({
        events: globalThis.__controlEvents,
        submissions: globalThis.__submissions,
    }))
    expect(state.submissions).toEqual([
        { action: '/table/1', method: 'POST', parameters: { _method: 'DELETE' } },
        { action: '/tree/5', method: 'POST', parameters: { _method: 'DELETE' } },
    ])
    expect(state.events).toEqual([
        nativeEvent('datatables::confirm::submitting', 'FORM', 'button.btn-delete'),
        nativeEvent('datatables::confirm::submitted', 'FORM', 'button.btn-delete'),
        nativeEvent('datatables::confirm::submitting', 'FORM', 'button.btn-destroy'),
        nativeEvent('datatables::confirm::submitted', 'FORM', 'button.btn-destroy'),
    ])
    expect(pageErrors).toEqual([])
})

test('form buttons preserve method, redirect and cancel events without jQuery objects', async ({
    page,
}) => {
    await openFixture(page)
    await page.locator('#form-delete').click()
    await expect.poll(() => submissionCount(page)).toBe(1)
    await page.locator('#form-restore').click()
    await expect.poll(() => submissionCount(page)).toBe(2)
    await page.evaluate(() => {
        globalThis.__confirmValue = false
    })
    await page.locator('#form-destroy').click()
    await expect.poll(() => eventCount(page)).toBe(3)

    const state = await page.evaluate(() => ({
        events: globalThis.__controlEvents,
        submissions: globalThis.__submissions,
    }))
    expect(state.submissions).toEqual([
        postSubmission('/forms/10', 'DELETE', '/forms'),
        postSubmission('/forms/10/restore', undefined, '/forms/10/edit'),
    ])
    expect(state.events).toEqual([
        nativeEvent('datatables::confirm::submitting', 'BUTTON'),
        nativeEvent('datatables::confirm::submitted', 'BUTTON'),
        nativeEvent('datatables::confirm::cancel', 'BUTTON'),
    ])
})

async function submissionCount(page) {
    return page.evaluate(() => globalThis.__submissions.length)
}

async function eventCount(page) {
    return page.evaluate(() => globalThis.__controlEvents.length)
}

function nativeEvent(name, targetTag, selector = null) {
    return { name, selector, targetIsElement: true, targetTag }
}

function postSubmission(action, method, redirect) {
    const parameters = { _redirectBack: redirect, _token: 'native-controls-token' }
    if (method) {
        parameters._method = method
    }

    return { action, method: 'POST', parameters }
}
