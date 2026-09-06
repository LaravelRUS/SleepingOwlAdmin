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
const readonlyFileProps = {
    csrfToken: 'fixture-token',
    labels: { browse: 'Upload file', download: 'Download' },
    maxFileSize: 2,
    messages: {
        confirmRemove: 'Remove file?',
        fileTooBig: 'File is too large',
        responseError: 'Upload error',
    },
    name: 'readonly-document',
    readonly: true,
    url: '/api/upload',
    value: 'docs/readonly.pdf',
}
const readonlyImageProps = {
    assetPrefix: '/cdn/',
    csrfToken: 'fixture-token',
    labels: {
        browse: 'Upload image',
        download: 'Download',
        insertLink: 'Insert link',
        remove: 'Remove image',
    },
    maxFileSize: 2,
    messages: {
        confirmRemove: 'Remove image?',
        fileTooBig: 'File is too large',
        invalidFileType: 'Wrong image type',
        responseError: 'Upload error',
    },
    name: 'readonly-image',
    onlyLink: false,
    readonly: true,
    url: '/api/upload',
    value: 'fixtures/readonly.svg',
}
const imagesLabels = {
    browse: 'Upload images',
    close: 'Close preview',
    download: 'Download',
    insertLink: 'Insert link',
    next: 'Next image',
    preview: 'Preview image',
    previous: 'Previous image',
    remove: 'Remove image',
    reorder: 'Change image order',
}
const readonlyImagesProps = {
    assetPrefix: '/cdn/',
    csrfToken: 'fixture-token',
    draggable: true,
    labels: imagesLabels,
    maxFileSize: 2,
    messages: readonlyImageProps.messages,
    name: 'readonly-gallery',
    onlyLink: false,
    readonly: true,
    url: '/api/upload',
    values: ['fixtures/readonly.svg', 'fixtures/second.svg'],
}

function capturePageErrors(page) {
    const errors = []
    page.on('pageerror', (error) => errors.push(error.stack || error.message))
    return errors
}

function expectNoUnexpectedPageErrors(errors) {
    expect(errors).toEqual([])
}

async function openFixture(page) {
    await page.goto('/legacy-vue')
    await expect(page.locator('html')).toHaveAttribute('data-ready', 'true')
    await expect(page.locator('#env-fixture .env-row')).toHaveCount(2)
    await expect.poll(() => page.evaluate(() => globalThis.Admin.VueApps.size)).toBe(8)
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

async function inspectReadonlyFile(page) {
    return page.evaluate((props) => {
        const host = globalThis.document.createElement('section')
        host.dataset.soaVueApp = ''
        host.dataset.soaVueComponent = 'element-file'
        host.dataset.soaVueProps = JSON.stringify(props)
        globalThis.document.body.append(host)
        globalThis.Admin.Components.scan(host)

        const result = {
            value: host.querySelector('[data-soa-file-value]').value,
            hasDownload: Boolean(host.querySelector('[data-soa-file-download]')),
            hasRemove: Boolean(host.querySelector('[data-soa-file-remove]')),
            hasUpload: Boolean(host.querySelector('.upload-button')),
        }

        globalThis.Admin.Components.destroy(host)
        host.remove()

        return result
    }, readonlyFileProps)
}

async function inspectReadonlyImage(page) {
    return page.evaluate((props) => {
        const host = globalThis.document.createElement('section')
        host.dataset.soaVueApp = ''
        host.dataset.soaVueComponent = 'element-image'
        host.dataset.soaVueProps = JSON.stringify(props)
        globalThis.document.body.append(host)
        globalThis.Admin.Components.scan(host)

        const result = {
            hasInsert: Boolean(host.querySelector('[data-soa-image-insert-current]')),
            hasRemove: Boolean(host.querySelector('[data-soa-image-remove]')),
            hasUpload: Boolean(host.querySelector('.upload-button')),
            preview: host.querySelector('[data-soa-image-preview]').getAttribute('src'),
            value: host.querySelector('[data-soa-image-value]').value,
        }

        globalThis.Admin.Components.destroy(host)
        host.remove()

        return result
    }, readonlyImageProps)
}

async function inspectReadonlyImages(page) {
    return page.evaluate((props) => {
        const host = globalThis.document.createElement('section')
        host.dataset.soaVueApp = ''
        host.dataset.soaVueComponent = 'element-images'
        host.dataset.soaVueProps = JSON.stringify(props)
        globalThis.document.body.append(host)
        globalThis.Admin.Components.scan(host)

        const result = {
            dragHandles: host.querySelectorAll('[data-soa-images-drag-handle]').length,
            editControls: host.querySelectorAll('[data-soa-images-insert]').length,
            firstPreview: host.querySelector('[data-soa-images-preview] img').src,
            removeControls: host.querySelectorAll('[data-soa-images-remove]').length,
            uploadControls: host.querySelectorAll('[data-soa-images-upload]').length,
            value: host.querySelector('[data-soa-images-value]').value,
        }

        globalThis.Admin.Components.destroy(host)
        host.remove()

        return result
    }, readonlyImagesProps)
}

async function mountOnlyLinkImage(page) {
    await page.evaluate((baseProps) => {
        const host = globalThis.document.createElement('section')
        host.id = 'only-link-image'
        host.dataset.soaVueApp = ''
        host.dataset.soaVueComponent = 'element-image'
        host.dataset.soaVueProps = JSON.stringify({
            ...baseProps,
            name: 'only-link-image',
            onlyLink: true,
            readonly: false,
            value: '',
        })
        globalThis.document.body.append(host)
        globalThis.Admin.Components.scan(host)
        globalThis.Admin.Messages.cliptobuffer = () => {
            const buffer = globalThis.document.createElement('img')
            buffer.id = 'image-paste-in-buffer'
            buffer.src = 'data:image/png;base64,QQ=='
            globalThis.document.querySelector('#vueApp').append(buffer)

            return Promise.resolve({ value: 'blob:link-only' })
        }
    }, readonlyImageProps)
}

async function mountOnlyLinkImages(page) {
    await page.evaluate((baseProps) => {
        const host = globalThis.document.createElement('section')
        host.id = 'only-link-images'
        host.dataset.soaVueApp = ''
        host.dataset.soaVueComponent = 'element-images'
        host.dataset.soaVueProps = JSON.stringify({
            ...baseProps,
            name: 'only-link-images',
            onlyLink: true,
            readonly: false,
            values: [],
        })
        globalThis.document.body.append(host)
        globalThis.Admin.Components.scan(host)
        globalThis.Admin.Messages.cliptobuffer = () => {
            const buffer = globalThis.document.createElement('img')
            buffer.id = 'image-paste-in-buffer'
            buffer.src = 'data:image/png;base64,QQ=='
            globalThis.document.querySelector('#vueApp').append(buffer)

            return Promise.resolve({ value: 'blob:link-only-gallery' })
        }
    }, readonlyImagesProps)
}

async function selectedValues(locator) {
    return locator.evaluate((select) =>
        Array.from(select.selectedOptions, (option) => option.value),
    )
}

async function readBoundedVueOwnership(page) {
    return page.evaluate((componentNames) => {
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
                globalThis.document.querySelector('#nested-image-wrapper').__vue_app__,
            ),
            prototypeTranslation: Boolean(globalThis.Vue.prototype?.$trans),
            translation: translation?.trans('lang.button.cancel'),
        }
    }, legacyVueComponentNames)
}

async function expectBoundedVueApps(page) {
    expect(await readBoundedVueOwnership(page)).toEqual({
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
            'nested-image-wrapper',
        ],
        nestedMounted: true,
        prototypeTranslation: false,
        translation: 'Cancel',
    })
}

async function expectInitialRelatedGroup(page) {
    await expect(page.locator('#existing-related-group')).toHaveAttribute(
        'data-lifecycle-mounted',
        'true',
    )
    await expect(page.locator('#nested-image-wrapper [data-soa-image-value]')).toHaveValue(
        'fixtures/pixel.svg',
    )
    await expect(page.locator('#related-name_0')).toHaveAttribute('name', 'name')
}

async function addAndExpectRelatedGroup(page) {
    await page.locator('#add-related-group').click()
    await expect(page.locator('#new-related-group-2')).toHaveAttribute(
        'data-lifecycle-mounted',
        'true',
    )
    await expect(page.locator('#dynamic-nested-image [data-soa-image-value]')).toHaveValue(
        'fixtures/second.svg',
    )
    await expect.poll(() => page.evaluate(() => globalThis.Admin.VueApps.size)).toBe(9)
    await expect(page.locator('#related-title_2')).toHaveAttribute('name', 'items[new_2][title]')
    await expect(page.locator('#related-status_2')).toHaveAttribute('name', 'items[new_2][status]')
    await expect(page.locator('#related-status_2')).toHaveClass(/select2-hidden-accessible/)
}

async function expectRelatedLifecycleCalls(page) {
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
}

async function removeAndExpectRelatedGroups(page) {
    await page.locator('#remove-existing-group').click()
    await expect(page.locator('.existing-related-group')).toHaveCount(0)
    await expect.poll(() => page.evaluate(() => globalThis.Admin.VueApps.size)).toBe(8)
    await expect(page.locator('.removed-related')).toHaveValue('42')
    await expect(page.locator('.removed-related')).toHaveAttribute('name', 'items[remove][]')
    await page.locator('.remove-new-group').click()
    await expect(page.locator('.new-related-group')).toHaveCount(0)
    await expect.poll(() => page.evaluate(() => globalThis.Admin.VueApps.size)).toBe(7)
    expect(await page.evaluate(() => globalThis.__componentDestroys)).toEqual(
        relatedLifecycleComponents,
    )
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
    await page.locator('#env_add_entry').click()
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
    const fileValue = page.locator('#file-wrapper [data-soa-file-value]')
    await expect(fileValue).toHaveValue('docs/start.pdf')
    await expect(page.locator('#file-wrapper [data-soa-file-download]')).toHaveAttribute(
        'href',
        /\/docs\/start\.pdf$/,
    )
    await runUploadCallback(page, '#file-wrapper .upload-button', 'docs/uploaded.pdf')
    await expect(fileValue).toHaveValue('docs/uploaded.pdf')
    await page.evaluate(() => {
        globalThis.Admin.Messages.confirm = () => Promise.resolve({ value: true })
    })
    await page.locator('#file-wrapper [data-soa-file-remove]').click()
    await expect(fileValue).toHaveValue('')

    const imageValue = page.locator('#image-wrapper [data-soa-image-value]')
    const imagePreview = page.locator('#image-wrapper [data-soa-image-preview]')
    await expect(imagePreview).toHaveAttribute('src', /\/fixtures\/pixel\.svg$/)
    await runUploadCallback(page, '#image-wrapper .upload-button', 'fixtures/uploaded.svg')
    await expect(imageValue).toHaveValue('fixtures/uploaded.svg')
    await expect(imagePreview).toHaveAttribute('src', /\/fixtures\/uploaded\.svg$/)
    await page.locator('#image-wrapper [data-soa-image-insert-current]').click()
    await expect(imageValue).toHaveValue('fixtures/linked.svg')
    await page.locator('#image-wrapper [data-soa-image-remove]').click()
    await expect(imageValue).toHaveValue('')

    await expect(page.locator('#images-wrapper [data-soa-images-value]')).toHaveValue(
        'fixtures/pixel.svg,fixtures/second.svg',
    )
    await runUploadCallback(page, '#images-wrapper .dropzone', 'fixtures/third.svg')
    await expect(page.locator('#images-wrapper [data-soa-images-value]')).toHaveValue(
        'fixtures/pixel.svg,fixtures/second.svg,fixtures/third.svg',
    )
    await page.locator('#images-wrapper .gallery-remove').first().click()
    await expect(page.locator('#images-wrapper [data-soa-images-value]')).toHaveValue(
        'fixtures/second.svg,fixtures/third.svg',
    )
})

test('images island opens and navigates its native image preview', async ({ page }) => {
    const pageErrors = capturePageErrors(page)
    await openFixture(page)

    await page.locator('#images-wrapper [data-soa-images-preview]').first().click()
    const dialog = page.locator('[data-soa-images-dialog]')
    await expect(dialog).toBeVisible()
    await expect(dialog.locator('.soa-images-dialog__position')).toHaveText('1 / 2')
    await dialog.locator('[data-soa-images-dialog-next]').click()
    await expect(dialog.locator('.soa-images-dialog__image')).toHaveAttribute(
        'src',
        /\/fixtures\/second\.svg$/,
    )
    await expect(dialog.locator('.soa-images-dialog__position')).toHaveText('2 / 2')
    await dialog.locator('[data-soa-images-dialog-close]').click()
    await expect(dialog).not.toBeVisible()
    expectNoUnexpectedPageErrors(pageErrors)
})

test('images island applies sortable order and destroys both drivers', async ({ page }) => {
    const pageErrors = capturePageErrors(page)
    await openFixture(page)
    await page.evaluate(() => {
        const host = globalThis.document.querySelector('#images-wrapper')
        const gallery = host.querySelector('[data-soa-images-gallery]')
        const sortableKey = Object.keys(gallery).find((key) => key.startsWith('Sortable'))
        gallery[sortableKey].options.onEnd({ newDraggableIndex: 1, oldDraggableIndex: 0 })
    })
    await expect(page.locator('#images-wrapper [data-soa-images-value]')).toHaveValue(
        'fixtures/second.svg,fixtures/pixel.svg',
    )
    const result = await page.evaluate(() => {
        const host = globalThis.document.querySelector('#images-wrapper')
        const gallery = host.querySelector('[data-soa-images-gallery]')
        const sortableKey = Object.keys(gallery).find((key) => key.startsWith('Sortable'))
        const existed = Boolean(gallery.dropzone && gallery[sortableKey])
        const lifecycleDestroyed = globalThis.Admin.Components.destroy(host)

        return {
            destroyed: !gallery.dropzone && !gallery[sortableKey],
            existed,
            lifecycleDestroyed,
            remainingApps: globalThis.Admin.VueApps.size,
        }
    })

    expect(result).toEqual({
        destroyed: true,
        existed: true,
        lifecycleDestroyed: 1,
        remainingApps: 7,
    })
    expectNoUnexpectedPageErrors(pageErrors)
})

test('readonly images island mounts neither editing nor sortable drivers', async ({ page }) => {
    const pageErrors = capturePageErrors(page)
    await openFixture(page)

    expect(await inspectReadonlyImages(page)).toEqual({
        dragHandles: 0,
        editControls: 0,
        firstPreview: 'http://127.0.0.1:4173/cdn/fixtures/readonly.svg',
        removeControls: 0,
        uploadControls: 0,
        value: 'fixtures/readonly.svg,fixtures/second.svg',
    })
    expectNoUnexpectedPageErrors(pageErrors)
})

test('link-only images island rejects blobs without creating an uploader', async ({ page }) => {
    const pageErrors = capturePageErrors(page)
    await openFixture(page)
    await mountOnlyLinkImages(page)

    await expect(page.locator('#only-link-images [data-soa-images-upload]')).toHaveCount(0)
    await page.locator('#only-link-images [data-soa-images-insert-new]').click()
    await expect(page.locator('#only-link-images [data-soa-images-value]')).toHaveValue('')
    await expect(page.locator('#image-paste-in-buffer')).toHaveCount(0)
    expect(
        await page.evaluate(() => {
            const host = globalThis.document.querySelector('#only-link-images')
            const destroyed = globalThis.Admin.Components.destroy(host)
            host.remove()

            return destroyed
        }),
    ).toBe(1)
    expectNoUnexpectedPageErrors(pageErrors)
})

test('images island uploads a pasted blob into the selected position', async ({ page }) => {
    const pageErrors = capturePageErrors(page)
    let uploadRequest
    await page.route('**/api/upload', async (route) => {
        uploadRequest = route.request()
        await route.fulfill({ json: { path: 'fixtures/replaced.svg' } })
    })
    await openFixture(page)
    await page.evaluate(() => {
        globalThis.Admin.Messages.cliptobuffer = () => {
            const buffer = globalThis.document.createElement('img')
            buffer.id = 'image-paste-in-buffer'
            buffer.dataset.ext = 'svg'
            buffer.src = 'data:image/svg+xml;base64,PHN2Zy8+'
            globalThis.document.querySelector('#vueApp').append(buffer)

            return Promise.resolve({ value: 'blob:replacement' })
        }
    })

    await page.locator('#images-wrapper [data-soa-images-insert]').first().click()
    await expect(page.locator('#images-wrapper [data-soa-images-value]')).toHaveValue(
        'fixtures/replaced.svg,fixtures/second.svg',
    )
    await expect(page.locator('#image-paste-in-buffer')).toHaveCount(0)
    expect(await uploadRequest.allHeaders()).toMatchObject({
        'x-csrf-token': 'browser-fixture-token',
        'x-requested-with': 'XMLHttpRequest',
    })
    expectNoUnexpectedPageErrors(pageErrors)
})

test('file island destroys its upload driver before unmount', async ({ page }) => {
    const pageErrors = capturePageErrors(page)
    await openFixture(page)

    const result = await page.evaluate(() => {
        const host = globalThis.document.querySelector('#file-wrapper')
        const button = host.querySelector('.upload-button')

        return {
            existed: Boolean(button.dropzone),
            lifecycleDestroyed: globalThis.Admin.Components.destroy(host),
            destroyed: !button.dropzone,
            remainingApps: globalThis.Admin.VueApps.size,
        }
    })

    expect(result).toEqual({
        existed: true,
        lifecycleDestroyed: 1,
        destroyed: true,
        remainingApps: 7,
    })
    expectNoUnexpectedPageErrors(pageErrors)
})

test('readonly file island renders without mounting an upload driver', async ({ page }) => {
    const pageErrors = capturePageErrors(page)
    await openFixture(page)
    const state = await inspectReadonlyFile(page)

    expect(state).toEqual({
        value: 'docs/readonly.pdf',
        hasDownload: true,
        hasRemove: false,
        hasUpload: false,
    })
    expectNoUnexpectedPageErrors(pageErrors)
})

test('image island destroys its upload driver before unmount', async ({ page }) => {
    const pageErrors = capturePageErrors(page)
    await openFixture(page)

    const result = await page.evaluate(() => {
        const host = globalThis.document.querySelector('#image-wrapper')
        const button = host.querySelector('.upload-button')
        const existed = Boolean(button.dropzone)
        const lifecycleDestroyed = globalThis.Admin.Components.destroy(host)

        return {
            destroyed: !button.dropzone,
            existed,
            lifecycleDestroyed,
            remainingApps: globalThis.Admin.VueApps.size,
        }
    })

    expect(result).toEqual({
        destroyed: true,
        existed: true,
        lifecycleDestroyed: 1,
        remainingApps: 7,
    })
    expectNoUnexpectedPageErrors(pageErrors)
})

test('readonly image island keeps prefixed preview without edit controls', async ({ page }) => {
    const pageErrors = capturePageErrors(page)
    await openFixture(page)
    const state = await inspectReadonlyImage(page)

    expect(state).toEqual({
        hasInsert: false,
        hasRemove: false,
        hasUpload: false,
        preview: '/cdn/fixtures/readonly.svg',
        value: 'fixtures/readonly.svg',
    })
    expectNoUnexpectedPageErrors(pageErrors)
})

test('link-only image island rejects blob values without creating an uploader', async ({
    page,
}) => {
    const pageErrors = capturePageErrors(page)
    await openFixture(page)
    await mountOnlyLinkImage(page)

    await expect(page.locator('#only-link-image .upload-button')).toHaveCount(0)
    await page.locator('#only-link-image [data-soa-image-insert-new]').click()
    await expect(page.locator('#only-link-image [data-soa-image-value]')).toHaveValue('')
    await expect(page.locator('#image-paste-in-buffer')).toHaveCount(0)
    expect(
        await page.evaluate(() => {
            const host = globalThis.document.querySelector('#only-link-image')
            const destroyed = globalThis.Admin.Components.destroy(host)
            host.remove()

            return destroyed
        }),
    ).toBe(1)
    expectNoUnexpectedPageErrors(pageErrors)
})

test('image island uploads a pasted blob through native Admin.Http', async ({ page }) => {
    const pageErrors = capturePageErrors(page)
    let uploadRequest
    await page.route('**/api/upload', async (route) => {
        uploadRequest = route.request()
        await route.fulfill({ json: { path: 'fixtures/pasted.svg' } })
    })
    await openFixture(page)
    await page.evaluate(() => {
        globalThis.Admin.Messages.cliptobuffer = () => {
            const buffer = globalThis.document.createElement('img')
            buffer.id = 'image-paste-in-buffer'
            buffer.dataset.ext = 'svg'
            buffer.src = 'data:image/svg+xml;base64,PHN2Zy8+'
            globalThis.document.querySelector('#vueApp').append(buffer)

            return Promise.resolve({ value: 'blob:pasted-image' })
        }
    })

    await page.locator('#image-wrapper [data-soa-image-insert-new]').click()
    await expect(page.locator('#image-wrapper [data-soa-image-value]')).toHaveValue(
        'fixtures/pasted.svg',
    )
    await expect(page.locator('#image-paste-in-buffer')).toHaveCount(0)
    expect(uploadRequest.method()).toBe('POST')
    expect(await uploadRequest.allHeaders()).toMatchObject({
        'x-csrf-token': 'browser-fixture-token',
        'x-requested-with': 'XMLHttpRequest',
    })
    expectNoUnexpectedPageErrors(pageErrors)
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
    await expectInitialRelatedGroup(page)
    await addAndExpectRelatedGroup(page)
    await expectRelatedLifecycleCalls(page)
    await removeAndExpectRelatedGroups(page)
})
