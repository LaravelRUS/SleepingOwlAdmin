import { URL } from 'node:url'

import { expect, test } from '@playwright/test'

const vueWarnings = new WeakMap()
const expectedCompatWarnings = ['COMPILER_INLINE_TEMPLATE']

function compatWarningId(message) {
    return message.match(/\(deprecation ([A-Z_]+)\)/)?.[1]
}

function compatWarningIds(page) {
    return [...new Set(vueWarnings.get(page).map(compatWarningId).filter(Boolean))]
}

function unexpectedVueWarnings(page) {
    return vueWarnings
        .get(page)
        .filter((message) => !expectedCompatWarnings.includes(compatWarningId(message)))
}

test.beforeEach(async ({ page }) => {
    const warnings = []
    page.on('console', (message) => {
        if (message.type() === 'warning' && message.text().startsWith('[Vue warn]')) {
            warnings.push(message.text())
        }
    })
    vueWarnings.set(page, warnings)
})

test.afterEach(async ({ page }) => {
    expect(unexpectedVueWarnings(page)).toEqual([])
})

// The published bundle disables discovery on the CommonJS wrapper, not its Dropzone constructor.
const knownLegacyPageErrors = ['Dropzone already attached.']
const legacyVueComponentNames = [
    'deselect',
    'element-file',
    'element-image',
    'element-images',
    'env_editor',
    'multiselect',
    'related-elements',
    'related-group',
]
const relatedLifecycleComponents = ['existing-related-group', 'new-related-group-2']

function capturePageErrors(page) {
    const errors = []
    page.on('pageerror', (error) => errors.push(error.stack || error.message))
    return errors
}

function expectNoUnexpectedPageErrors(errors) {
    const unexpectedErrors = errors.filter(
        (error) => !knownLegacyPageErrors.includes(pageErrorMessage(error)),
    )

    expect(unexpectedErrors).toEqual([])
}

function pageErrorMessage(error) {
    return error.split('\n', 1)[0].replace(/^Error:\s*/, '')
}

async function openFixture(page) {
    await page.goto('/legacy-vue')
    await expect(page.locator('html')).toHaveAttribute('data-ready', 'true')
    await expect(page.locator('#env-fixture .env-row')).toHaveCount(2)
    await expect.poll(() => page.evaluate(() => globalThis.Admin.VueApps.size)).toBe(7)
}

async function useProductionBundle(page) {
    await page.route('**/public/default/js/admin-app-dev.js', (route) => {
        const url = new URL('/public/default/js/admin-app.js', route.request().url())

        return route.continue({ url: url.href })
    })
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

async function expectBoundedVueApps(page) {
    const ownership = await page.evaluate((componentNames) => {
        const hosts = [...globalThis.document.querySelectorAll('[data-soa-vue-app]')]
        const mountedHosts = hosts.filter((element) => element.__vue_app__)
        const firstApp = globalThis.Admin.VueApps.get(mountedHosts[0])
        const translation = firstApp.runWithContext(() =>
            globalThis.Vue.inject(Symbol.for('sleepingowl.admin.vue.translation'), null),
        )

        return {
            componentsAreLocal: mountedHosts.every((element) =>
                componentNames.every((name) =>
                    globalThis.Admin.VueApps.get(element).component(name),
                ),
            ),
            layoutMounted: Boolean(globalThis.document.querySelector('#vueApp').__vue_app__),
            mountedIds: mountedHosts.map((element) => element.id),
            nestedMounted: Boolean(
                globalThis.document.querySelector('#nested-vue-marker').__vue_app__,
            ),
            prototypeTranslation: Boolean(globalThis.Vue.prototype?.$trans),
            translation: translation?.trans('lang.button.cancel'),
        }
    }, legacyVueComponentNames)

    expect(ownership).toEqual({
        componentsAreLocal: true,
        layoutMounted: false,
        mountedIds: [
            'env-fixture',
            'file-wrapper',
            'image-wrapper',
            'images-wrapper',
            'single-select-fixture',
            'multi-select-fixture',
            'related-fixture',
        ],
        nestedMounted: false,
        prototypeTranslation: false,
        translation: 'Cancel',
    })
}

test('bounded Vue 3 compat apps preserve env editor behavior', async ({ page }) => {
    const pageErrors = capturePageErrors(page)
    await openFixture(page)
    expect(await page.evaluate(() => globalThis.Vue.version)).toMatch(/^3\.5\./)
    expect(compatWarningIds(page)).toEqual(expectedCompatWarnings)
    await expectBoundedVueApps(page)

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

test('production Vue 3 compat bundle mounts bounded apps', async ({ page }) => {
    await useProductionBundle(page)
    await openFixture(page)

    expect(await page.evaluate(() => globalThis.Vue.version)).toMatch(/^3\.5\./)
    await expect(page.locator('#single-select')).toHaveValue('2')
    await expect(page.locator('#existing-related-group')).toHaveAttribute(
        'data-lifecycle-mounted',
        'true',
    )
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
