import { expect, test } from '@playwright/test'

// The published bundle disables discovery on the CommonJS wrapper, not its Dropzone constructor.
const knownLegacyPageErrors = ['Dropzone already attached.']
const relatedLifecycleComponents = ['existing-related-group', 'new-related-group-2']

function capturePageErrors(page) {
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    return errors
}

function expectNoUnexpectedPageErrors(errors) {
    const unexpectedErrors = errors.filter((error) => !knownLegacyPageErrors.includes(error))

    expect(unexpectedErrors).toEqual([])
}

async function openFixture(page) {
    await page.goto('/legacy-vue')
    await expect(page.locator('html')).toHaveAttribute('data-ready', 'true')
    await expect(page.locator('#env-fixture .env-row')).toHaveCount(2)
}

async function runUploadCallback(page, selector, value) {
    await page.evaluate(
        ({ selector: target, value: uploadedValue }) => {
            const dropzone = globalThis.document.querySelector(target).dropzone
            dropzone.options.sending.call(dropzone)
            dropzone.options.success.call(dropzone, {}, { value: uploadedValue })
            dropzone.options.complete.call(dropzone)
        },
        { selector, value },
    )
}

async function selectedValues(locator) {
    return locator.evaluate((select) =>
        Array.from(select.selectedOptions, (option) => option.value),
    )
}

test('global Vue 2 root mounts env editor and preserves add/remove rules', async ({ page }) => {
    const pageErrors = capturePageErrors(page)
    await openFixture(page)
    expect(await page.evaluate(() => globalThis.Vue.version)).toMatch(/^2\./)

    await page.locator('#env-fixture .env-remove').nth(1).click()
    await expect(page.locator('#env-fixture .env-row')).toHaveCount(2)
    expect(await page.evaluate(() => globalThis.__toasts)).toEqual(['Access denied'])

    await page.locator('#env-fixture .env-remove').first().click()
    await expect(page.locator('#env-fixture .env-row')).toHaveCount(1)
    await page.locator('#env-add-entry').click()
    await expect(page.locator('#env-fixture .env-row')).toHaveCount(2)
    await page.locator('#env-fixture .env-key').last().fill('NEW_KEY')
    await expect(page.locator('#env-fixture .env-key').last()).toHaveAttribute(
        'name',
        'variables[NEW_KEY][key]',
    )
    expectNoUnexpectedPageErrors(pageErrors)
})

test('legacy tab state restores and updates without leaking globals', async ({ page }) => {
    const pageErrors = capturePageErrors(page)
    await page.addInitScript(() => {
        globalThis.localStorage.setItem('Tabbed_/legacy-vue', JSON.stringify({ 0: 'second-tab' }))
    })
    await openFixture(page)

    await expect(page.locator('#second-tab-control')).toHaveClass(/active/)
    await page.locator('#first-tab-control').click()
    await expect
        .poll(() =>
            page.evaluate(() => JSON.parse(globalThis.localStorage.getItem('Tabbed_/legacy-vue'))),
        )
        .toEqual({ 0: 'first-tab' })
    expectNoUnexpectedPageErrors(pageErrors)
})

test('file, image and images components expose values and upload callbacks', async ({ page }) => {
    await openFixture(page)
    await expect(page.locator('#file-value')).toHaveValue('docs/start.pdf')
    await expect(page.locator('#file-link')).toHaveAttribute('href', /\/docs\/start\.pdf$/)
    await runUploadCallback(page, '#file-wrapper .upload-button', 'docs/uploaded.pdf')
    await expect(page.locator('#file-value')).toHaveValue('docs/uploaded.pdf')

    await expect(page.locator('#image-preview')).toHaveAttribute('src', /\/fixtures\/pixel\.svg$/)
    await runUploadCallback(page, '#image-wrapper .upload-button', 'fixtures/uploaded.svg')
    await expect(page.locator('#image-value')).toHaveValue('fixtures/uploaded.svg')
    await expect(page.locator('#image-preview')).toHaveAttribute(
        'src',
        /\/fixtures\/uploaded\.svg$/,
    )

    await expect(page.locator('#images-value')).toHaveValue(
        'fixtures/pixel.svg,fixtures/second.svg',
    )
    await runUploadCallback(page, '#images-wrapper .dropzone', 'fixtures/third.svg')
    await expect(page.locator('#images-value')).toHaveValue(
        'fixtures/pixel.svg,fixtures/second.svg,fixtures/third.svg',
    )
    await page.locator('#images-wrapper .gallery-remove').first().click()
    await expect(page.locator('#images-value')).toHaveValue(
        'fixtures/second.svg,fixtures/third.svg',
    )
})

test('single and multiple Vue Multiselect fields synchronize submitted values', async ({
    page,
}) => {
    await openFixture(page)
    await expect(page.locator('#single-select')).toHaveValue('2')
    await page.locator('#single-select-fixture .multiselect').click()
    await page
        .locator('#single-select-fixture .multiselect__option')
        .filter({ hasText: 'Three' })
        .click()
    await expect(page.locator('#single-select')).toHaveValue('3')

    expect(await selectedValues(page.locator('#multi-select'))).toEqual(['1', '3'])
    await page.locator('#multi-select-fixture .multiselect').click()
    await page
        .locator('#multi-select-fixture .multiselect__option')
        .filter({ hasText: 'Two' })
        .click()
    expect(await selectedValues(page.locator('#multi-select'))).toEqual(['1', '2', '3'])

    const input = page.locator('#multi-select-fixture .multiselect__input')
    await page.locator('#multi-select-fixture .multiselect').click()
    await input.fill('Custom')
    await input.press('Enter')
    expect(await selectedValues(page.locator('#multi-select'))).toEqual(['1', '2', '3', 'Custom'])
})

test('related elements rewrite new field names and initialize dynamic controls', async ({
    page,
}) => {
    await openFixture(page)
    await expect(page.locator('#existing-related-group')).toHaveAttribute(
        'data-lifecycle-mounted',
        'true',
    )
    await expect(page.locator('#related-name_0')).toHaveAttribute('name', 'name')
    await page.locator('#add-related-group').click()
    await expect(page.locator('#new-related-group-2')).toHaveAttribute(
        'data-lifecycle-mounted',
        'true',
    )
    await expect(page.locator('#related-title_2')).toHaveAttribute('name', 'items[new_2][title]')
    await expect(page.locator('#related-status_2')).toHaveAttribute('name', 'items[new_2][status]')
    await expect(page.locator('#related-status_2')).toHaveClass(/select2-hidden-accessible/)

    const calls = await page.evaluate(() => globalThis.__moduleCalls)
    expect(calls).toEqual(
        expect.arrayContaining([
            'form.elements.date',
            'form.elements.select',
            'form.elements.wysiwyg',
        ]),
    )
    expect(await page.evaluate(() => globalThis.Admin.Components.scan(globalThis.document))).toBe(0)
    expect(await page.evaluate(() => globalThis.__componentMounts)).toEqual(
        relatedLifecycleComponents,
    )
    await page.locator('#remove-existing-group').click()
    await expect(page.locator('.existing-related-group')).toHaveCount(0)
    await expect(page.locator('.removed-related')).toHaveValue('42')
    await expect(page.locator('.removed-related')).toHaveAttribute('name', 'items[remove][]')
    await page.locator('.remove-new-group').click()
    await expect(page.locator('.new-related-group')).toHaveCount(0)
    expect(await page.evaluate(() => globalThis.__componentDestroys)).toEqual(
        relatedLifecycleComponents,
    )
})
