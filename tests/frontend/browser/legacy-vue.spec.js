import { URL } from 'node:url'

import { expect, test } from '@playwright/test'

const vueWarnings = new WeakMap()

function unexpectedVueWarnings(page) {
    return vueWarnings.get(page)
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
    'element-file',
    'element-image',
    'element-images',
    'element-select',
    'env_editor',
    'related-elements',
]
const relatedLifecycleComponents = [
    'existing-related-group',
    'new-related-group-2',
    'new-related-group-3',
]
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
const readonlyRequiredSelectProps = {
    attributes: {
        class: 'form-control project-readonly',
        disabled: 'disabled',
        id: 'readonly-select',
        multiple: 'multiple',
        name: 'readonly[]',
    },
    classes: { required: 'project-required-message project-spacing' },
    labels: {
        deselect: 'Deselect',
        noItems: 'No items',
        placeholder: 'Choose',
        required: 'Readonly selection is required',
        select: 'Select',
        selected: 'Selected',
    },
    limit: 1,
    max: 2,
    multiple: true,
    options: [{ id: 'one', text: 'One' }],
    readonly: true,
    required: true,
    taggable: false,
    value: [],
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
    await expect(page.locator('#env-fixture [data-env-row]')).toHaveCount(2)
    await expect.poll(() => page.evaluate(() => globalThis.Admin.VueApps.size)).toBe(8)
}

async function useProductionBundle(page) {
    const replacements = new Map([
        ['/public/default/js/admin-app-dev.js', '/public/default/js/admin-app.js'],
        ['/public/default/js/vue-dev.js', '/public/default/js/vue.js'],
    ])

    await page.route('**/public/default/js/*-dev.js', (route) => {
        const requestUrl = new URL(route.request().url())
        const replacement = replacements.get(requestUrl.pathname)
        if (!replacement) return route.continue()

        const url = new URL(replacement, requestUrl)

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

async function expectFilePresentationClasses(file) {
    await expect(file.locator('[data-file-current]')).toHaveClass('project-file-current')
    await expect(file.locator('[data-file-item]')).toHaveClass('project-file-item')
    await expect(file.locator('.project-file-visual')).toHaveCount(1)
    await expect(file.locator('.project-file-current-icon')).toHaveCount(1)
    await expect(file.locator('.project-file-info')).toHaveCount(1)
    await expect(file.locator('[data-file-download]')).toHaveClass('project-file-download')
    await expect(file.locator('[data-file-download] i')).toHaveClass('project-file-download-icon')
    await expect(file.locator('[data-file-remove]')).toHaveClass('project-file-remove')
    await expect(file.locator('[data-file-remove] i')).toHaveClass('project-file-remove-icon')
    await expect(file.locator('[data-file-upload]')).toHaveClass(/\bproject-file-upload\b/)
    await expect(file.locator('[data-file-upload-icon]')).toHaveClass('project-file-upload-icon')
}

async function expectImagePresentationClasses(image) {
    await expect(image.locator('[data-image-current]')).toHaveClass('project-image-current')
    await expect(image.locator('[data-image-item]')).toHaveClass('project-image-item')
    await expect(image.locator('[data-image-preview-link]')).toHaveClass(
        'project-image-preview-link',
    )
    await expect(image.locator('[data-image-info]')).toHaveClass('project-image-info')
    await expect(image.locator('[data-image-download]')).toHaveClass('project-image-download')
    await expect(image.locator('[data-image-download] i')).toHaveClass(
        'project-image-download-icon',
    )
    await expect(image.locator('[data-image-insert-current]')).toHaveClass(
        'project-image-insert-current',
    )
    await expect(image.locator('[data-image-remove]')).toHaveClass('project-image-remove')
    await expect(image.locator('[data-image-remove] i')).toHaveClass('project-image-remove-icon')
    await expect(image.locator('[data-image-upload]')).toHaveClass(/\bproject-image-upload\b/)
    await expect(image.locator('[data-image-upload-icon]')).toHaveClass('project-image-upload-icon')
    await expect(image.locator('[data-image-insert-new]')).toHaveClass('project-image-insert-new')
    await expect(image.locator('[data-image-insert-new] i')).toHaveClass(
        'project-image-insert-icon',
    )
}

async function inspectReadonlyFile(page) {
    return page.evaluate((props) => {
        const host = globalThis.document.createElement('section')
        host.dataset.vueApp = ''
        host.dataset.vueComponent = 'element-file'
        host.dataset.vueProps = JSON.stringify(props)
        globalThis.document.body.append(host)
        globalThis.Admin.Components.scan(host)

        const result = {
            value: host.querySelector('[data-file-value]').value,
            hasDownload: Boolean(host.querySelector('[data-file-download]')),
            hasRemove: Boolean(host.querySelector('[data-file-remove]')),
            hasUpload: Boolean(host.querySelector('[data-file-upload]')),
        }

        globalThis.Admin.Components.destroy(host)
        host.remove()

        return result
    }, readonlyFileProps)
}

async function inspectReadonlyImage(page) {
    return page.evaluate((props) => {
        const host = globalThis.document.createElement('section')
        host.dataset.vueApp = ''
        host.dataset.vueComponent = 'element-image'
        host.dataset.vueProps = JSON.stringify(props)
        globalThis.document.body.append(host)
        globalThis.Admin.Components.scan(host)

        const result = {
            hasInsert: Boolean(host.querySelector('[data-image-insert-current]')),
            hasRemove: Boolean(host.querySelector('[data-image-remove]')),
            hasUpload: Boolean(host.querySelector('[data-image-upload]')),
            preview: host.querySelector('[data-image-preview]').getAttribute('src'),
            value: host.querySelector('[data-image-value]').value,
        }

        globalThis.Admin.Components.destroy(host)
        host.remove()

        return result
    }, readonlyImageProps)
}

async function inspectReadonlyImages(page) {
    return page.evaluate((props) => {
        const host = globalThis.document.createElement('section')
        host.dataset.vueApp = ''
        host.dataset.vueComponent = 'element-images'
        host.dataset.vueProps = JSON.stringify(props)
        globalThis.document.body.append(host)
        globalThis.Admin.Components.scan(host)

        const result = {
            dragHandles: host.querySelectorAll('[data-images-drag-handle]').length,
            editControls: host.querySelectorAll('[data-images-insert]').length,
            firstPreview: host.querySelector('[data-images-preview] img').src,
            removeControls: host.querySelectorAll('[data-images-remove]').length,
            uploadControls: host.querySelectorAll('[data-images-upload]').length,
            value: host.querySelector('[data-images-value]').value,
        }

        globalThis.Admin.Components.destroy(host)
        host.remove()

        return result
    }, readonlyImagesProps)
}

async function inspectReadonlyRequiredSelect(page) {
    return page.evaluate((props) => {
        const host = globalThis.document.createElement('section')
        host.dataset.vueApp = ''
        host.dataset.vueComponent = 'element-select'
        host.dataset.vueProps = JSON.stringify(props)
        globalThis.document.body.append(host)
        globalThis.Admin.Components.scan(host)

        const control = host.querySelector('[data-select-native]')
        const result = {
            className: control.className,
            disabled: control.disabled,
            error: host.querySelector('[data-select-required]')?.textContent.trim(),
            errorClass: host.querySelector('[data-select-required]')?.className,
            widgetDisabled: host
                .querySelector('.multiselect')
                .classList.contains('multiselect--disabled'),
        }

        globalThis.Admin.Components.destroy(host)
        host.remove()

        return result
    }, readonlyRequiredSelectProps)
}

async function mountOnlyLinkImage(page) {
    await page.evaluate((baseProps) => {
        const host = globalThis.document.createElement('section')
        host.id = 'only-link-image'
        host.dataset.vueApp = ''
        host.dataset.vueComponent = 'element-image'
        host.dataset.vueProps = JSON.stringify({
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
        host.dataset.vueApp = ''
        host.dataset.vueComponent = 'element-images'
        host.dataset.vueProps = JSON.stringify({
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

async function chooseSelectOption(page, fixture, text) {
    await page.locator(`${fixture} .multiselect`).click()
    await page.locator(`${fixture} .multiselect__option`).filter({ hasText: text }).click()
}

async function expectSingleSelectBehavior(page) {
    const control = page.locator('#single-select')
    await expect(control).toHaveValue('2')
    await expect(control).toHaveClass(/project-select/)
    await expect(control).toHaveAttribute('data-contract', 'single')
    await expect(control).toHaveAttribute('aria-label', 'Status')

    await chooseSelectOption(page, '#single-select-fixture', 'Code')
    await expect(control).toHaveValue('sku')
    await chooseSelectOption(page, '#single-select-fixture', 'None')
    await expect(control).toHaveValue('')
}

async function enterSelectTag(page, value) {
    await page.locator('#multi-select-fixture .multiselect').click()
    const input = page.locator('#multi-select-fixture .multiselect__input')
    await input.fill(value)
    await input.press('Enter')
}

async function expectMultipleSelectBehavior(page) {
    const control = page.locator('#multi-select')
    expect(await selectedValues(control)).toEqual(['1', '3'])
    await expect(control).toHaveClass(/project-multiselect/)
    await expect(control).toHaveAttribute('name', 'categories[]')

    await chooseSelectOption(page, '#multi-select-fixture', 'Two')
    expect(await selectedValues(control)).toEqual(['1', '2', '3'])
    await expect(page.locator('#multi-select-fixture .multiselect__strong')).toContainText('1')
    await enterSelectTag(page, 'Custom')
    expect(await selectedValues(control)).toEqual(['1', '2', '3', 'Custom'])
    await enterSelectTag(page, 'Overflow')
    expect(await selectedValues(control)).toEqual(['1', '2', '3', 'Custom'])
}

async function expectSelectChangeEvents(page) {
    expect(await page.evaluate(() => globalThis.__selectChanges)).toEqual([
        { id: 'single-select', values: ['sku'] },
        { id: 'single-select', values: [''] },
        { id: 'multi-select', values: ['1', '2', '3'] },
        { id: 'multi-select', values: ['1', '2', '3', 'Custom'] },
    ])
}

async function expectReadonlyRequiredSelect(page) {
    expect(await inspectReadonlyRequiredSelect(page)).toEqual({
        className: 'form-control project-readonly',
        disabled: true,
        error: 'Readonly selection is required',
        errorClass: 'project-required-message project-spacing',
        widgetDisabled: true,
    })
}

async function readBoundedVueOwnership(page) {
    return page.evaluate((componentNames) => {
        const hosts = [...globalThis.document.querySelectorAll('[data-vue-app]')]
        const mountedHosts = hosts.filter((element) => element.__vue_app__)
        const firstApp = globalThis.Admin.VueApps.get(mountedHosts[0])

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
            globalVue: typeof globalThis.Vue,
            runtimeVersion: firstApp.version,
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
        globalVue: 'undefined',
        runtimeVersion: expect.stringMatching(/^3\.5\./),
    })
}

async function expectInitialRelatedGroup(page) {
    await expect(page.locator('#related-fixture [data-related-root]')).toHaveClass(
        'project-related-root',
    )
    await expect(page.locator('#related-fixture [data-related-groups]')).toHaveClass(
        'project-related-groups',
    )
    await expect(page.locator('#related-fixture [data-related-actions]')).toHaveClass(
        'project-related-actions',
    )
    await expect(page.locator('#related-fixture [data-related-add]')).toHaveClass(
        'project-related-add',
    )
    await expect(page.locator('#related-fixture [data-related-add-icon]')).toHaveClass(
        'project-related-icon',
    )
    await expect(page.locator('#existing-related-group')).toHaveAttribute(
        'data-lifecycle-mounted',
        'true',
    )
    await expect(page.locator('#nested-image-wrapper [data-image-value]')).toHaveValue(
        'fixtures/pixel.svg',
    )
    await expect(page.locator('#nested-image-wrapper [data-image-value]')).toHaveAttribute(
        'name',
        'items[42][image]',
    )
    await expect(page.locator('#related-name_0')).toHaveAttribute('name', 'items[42][name]')
}

async function addAndExpectRelatedGroup(page) {
    await page.locator('[data-related-add]').click()
    await expectFirstAddedRelatedGroup(page)

    await page.locator('[data-related-add]').click()
    await expectSecondAddedRelatedGroup(page)
}

async function expectFirstAddedRelatedGroup(page) {
    await expect(page.locator('[data-related-index="2"]')).toHaveAttribute(
        'data-lifecycle-mounted',
        'true',
    )
    await expect(page.locator('[data-related-index="2"] [data-image-value]')).toHaveValue(
        'fixtures/second.svg',
    )
    await expect(page.locator('[data-related-index="2"] [data-image-value]')).toHaveAttribute(
        'name',
        'items[new_2][image]',
    )
    await expect(page.locator('[data-related-index="2"] .dynamic-nested-image')).toHaveAttribute(
        'data-vue-props-id',
        'dynamic-image-props--new-2-0',
    )
    await expect.poll(() => page.evaluate(() => globalThis.Admin.VueApps.size)).toBe(9)
    await expect(page.locator('#related-title_2')).toHaveAttribute('name', 'items[new_2][title]')
    await expect(page.locator('#related-status_2')).toHaveAttribute('name', 'items[new_2][status]')
    await expect(page.locator('#related-status_2')).toHaveClass('input-select')
    await expect(page.locator('[data-related-index="2"] .select2-container')).toHaveCount(0)
    await expect(page.locator('[data-related-index="2"] .raw-related-template-probe')).toHaveText(
        'Server HTML stays inert',
    )
}

async function expectSecondAddedRelatedGroup(page) {
    await expect(page.locator('[data-related-index="3"]')).toHaveAttribute(
        'data-lifecycle-mounted',
        'true',
    )
    await expect(page.locator('#related-title_3')).toHaveAttribute('name', 'items[new_3][title]')
    await expect(page.locator('#related-status_3')).toHaveAttribute('name', 'items[new_3][status]')
    await expect(page.locator('[data-related-index="3"] [data-image-value]')).toHaveAttribute(
        'name',
        'items[new_3][image]',
    )
    await expect(page.locator('[data-related-index="3"] .dynamic-nested-image')).toHaveAttribute(
        'data-vue-props-id',
        'dynamic-image-props--new-3-0',
    )
    await expect(page.locator('[data-related-add]')).toHaveCount(0)
    await expect.poll(() => page.evaluate(() => globalThis.Admin.VueApps.size)).toBe(10)
}

async function expectRelatedLifecycleCalls(page) {
    const calls = await page.evaluate(() => globalThis.__moduleCalls)
    expect(calls).toEqual(expect.arrayContaining(['form.elements.wysiwyg']))
    expect(calls).not.toContain('form.elements.dependent-select')
    expect(calls).not.toContain('form.elements.select')
    expect(calls).not.toContain('form.elements.selectajax')
    expect(await page.evaluate(() => globalThis.Admin.Components.scan(globalThis.document))).toBe(0)
    expect(await page.evaluate(() => globalThis.__componentMounts)).toEqual(
        relatedLifecycleComponents,
    )
}

async function removeAndExpectRelatedGroups(page) {
    await page.locator('#remove-existing-group').click()
    await expect(page.locator('.existing-related-group')).toHaveCount(0)
    await expect.poll(() => page.evaluate(() => globalThis.Admin.VueApps.size)).toBe(9)
    await expect(page.locator('[data-related-removed]')).toHaveValue('42')
    await expect(page.locator('[data-related-removed]')).toHaveAttribute('name', 'items[remove][]')
    await page.locator('.remove-new-group').first().click()
    await page.locator('.remove-new-group').click()
    await expect(page.locator('.new-related-group')).toHaveCount(0)
    await expect.poll(() => page.evaluate(() => globalThis.Admin.VueApps.size)).toBe(7)
    expect(await page.evaluate(() => globalThis.__componentDestroys)).toEqual(
        relatedLifecycleComponents,
    )
}

test('bounded runtime-only Vue 3 apps preserve env editor behavior', async ({ page }) => {
    const pageErrors = capturePageErrors(page)
    await openFixture(page)
    expect(await page.evaluate(() => typeof globalThis.Vue)).toBe('undefined')
    await expectBoundedVueApps(page)
    await expect(page.locator('#env-fixture [data-env-card]')).toHaveClass('project-env-card')
    await expect(page.locator('#env-fixture [data-env-table]')).toHaveClass('project-env-table')
    await expect(page.locator('#env-fixture [data-env-key]').first()).toHaveClass('project-env-key')
    await expect(page.locator('#env-fixture [data-env-value]').first()).toHaveClass(
        'project-env-value',
    )
    await expect(page.locator('#env-fixture [data-env-remove]').first()).toHaveClass(
        'project-env-remove',
    )
    await expect(page.locator('#env-fixture [data-env-remove]').first()).toHaveAttribute(
        'title',
        'Remove',
    )
    await expect(page.locator('#env-fixture [data-env-add]')).toHaveClass('project-env-add')
    await expect(page.locator('#env-fixture [data-env-save]')).toHaveClass('project-env-save')

    await page.locator('#env-fixture [data-env-remove]').nth(1).click()
    await expect(page.locator('#env-fixture [data-env-row]')).toHaveCount(2)
    expect(await page.evaluate(() => globalThis.__toasts)).toEqual(['Access denied'])

    await page.locator('#env-fixture [data-env-remove]').first().click()
    await expect(page.locator('#env-fixture [data-env-row]')).toHaveCount(1)
    await page.locator('#env_add_entry').click()
    await expect(page.locator('#env-fixture [data-env-row]')).toHaveCount(2)
    await page.locator('#env-fixture [data-env-key]').last().fill('NEW_KEY')
    await expect(page.locator('#env-fixture [data-env-key]').last()).toHaveAttribute(
        'name',
        'variables[NEW_KEY][key]',
    )
    expectNoUnexpectedPageErrors(pageErrors)
})

test('production runtime-only Vue 3 bundle mounts bounded apps', async ({ page }) => {
    await useProductionBundle(page)
    await openFixture(page)

    expect(await page.evaluate(() => typeof globalThis.Vue)).toBe('undefined')
    expect(
        await page.evaluate(() => {
            const host = globalThis.document.querySelector('#env-fixture')

            return globalThis.Admin.VueApps.get(host).version
        }),
    ).toMatch(/^3\.5\./)
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
    const fileValue = page.locator('#file-wrapper [data-file-value]')
    await expect(fileValue).toHaveValue('docs/start.pdf')
    await expect(page.locator('#file-wrapper [data-file-download]')).toHaveAttribute(
        'href',
        /\/docs\/start\.pdf$/,
    )
    await runUploadCallback(page, '#file-wrapper [data-file-upload]', 'docs/uploaded.pdf')
    await expect(fileValue).toHaveValue('docs/uploaded.pdf')
    await page.evaluate(() => {
        globalThis.Admin.Messages.confirm = () => Promise.resolve({ value: true })
    })
    await page.locator('#file-wrapper [data-file-remove]').click()
    await expect(fileValue).toHaveValue('')

    const imageValue = page.locator('#image-wrapper [data-image-value]')
    const imagePreview = page.locator('#image-wrapper [data-image-preview]')
    await expect(imagePreview).toHaveAttribute('src', /\/fixtures\/pixel\.svg$/)
    await runUploadCallback(page, '#image-wrapper [data-image-upload]', 'fixtures/uploaded.svg')
    await expect(imageValue).toHaveValue('fixtures/uploaded.svg')
    await expect(imagePreview).toHaveAttribute('src', /\/fixtures\/uploaded\.svg$/)
    await page.locator('#image-wrapper [data-image-insert-current]').click()
    await expect(imageValue).toHaveValue('fixtures/linked.svg')
    await page.locator('#image-wrapper [data-image-remove]').click()
    await expect(imageValue).toHaveValue('')

    await expect(page.locator('#images-wrapper [data-images-value]')).toHaveValue(
        'fixtures/pixel.svg,fixtures/second.svg',
    )
    await runUploadCallback(page, '#images-wrapper .dropzone', 'fixtures/third.svg')
    await expect(page.locator('#images-wrapper [data-images-value]')).toHaveValue(
        'fixtures/pixel.svg,fixtures/second.svg,fixtures/third.svg',
    )
    await page.locator('#images-wrapper .gallery-remove').first().click()
    await expect(page.locator('#images-wrapper [data-images-value]')).toHaveValue(
        'fixtures/second.svg,fixtures/third.svg',
    )
})

test('file island consumes Blade-owned classes without an AdminLTE class contract', async ({
    page,
}) => {
    const pageErrors = capturePageErrors(page)
    await openFixture(page)
    const file = page.locator('#file-wrapper')

    await expectFilePresentationClasses(file)

    await page.evaluate(() => {
        globalThis.Admin.Messages.error = () => undefined
        const upload = globalThis.document.querySelector(
            '#file-wrapper [data-file-upload]',
        ).dropzone
        upload.options.sending.call(upload)
    })
    await expect(file.locator('[data-file-upload-icon]')).toHaveClass('project-file-uploading-icon')

    await page.evaluate(() => {
        const upload = globalThis.document.querySelector(
            '#file-wrapper [data-file-upload]',
        ).dropzone
        upload.options.error.call(upload, {}, { errors: ['Upload rejected'] })
        upload.options.complete.call(upload)
    })
    await expect(file.locator('[data-file-alert]')).toHaveClass('project-file-alert')
    await expect(file.locator('[data-file-alert-close]')).toHaveClass('project-file-alert-close')
    await expect(file.locator('[data-file-error-icon]')).toHaveClass('project-file-error-icon')
    await expect(file.locator('[data-file-upload-icon]')).toHaveClass('project-file-upload-icon')
    await file.locator('[data-file-alert-close]').click()
    await expect(file.locator('[data-file-alert]')).toHaveCount(0)
    expectNoUnexpectedPageErrors(pageErrors)
})

test('image island consumes Blade-owned classes without an AdminLTE class contract', async ({
    page,
}) => {
    const pageErrors = capturePageErrors(page)
    await openFixture(page)
    const image = page.locator('#image-wrapper')

    await expectImagePresentationClasses(image)

    await page.evaluate(() => {
        globalThis.Admin.Messages.error = () => undefined
        const upload = globalThis.document.querySelector(
            '#image-wrapper [data-image-upload]',
        ).dropzone
        upload.options.sending.call(upload)
    })
    await expect(image.locator('[data-image-upload-icon]')).toHaveClass(
        'project-image-uploading-icon',
    )

    await page.evaluate(() => {
        const upload = globalThis.document.querySelector(
            '#image-wrapper [data-image-upload]',
        ).dropzone
        upload.options.error.call(upload, {}, { errors: ['Image rejected'] })
        upload.options.complete.call(upload)
    })
    await expect(image.locator('[data-image-alert]')).toHaveClass('project-image-alert')
    await expect(image.locator('[data-image-alert-close]')).toHaveClass('project-image-alert-close')
    await expect(image.locator('[data-image-error-icon]')).toHaveClass('project-image-error-icon')
    await expect(image.locator('[data-image-upload-icon]')).toHaveClass('project-image-upload-icon')
    await image.locator('[data-image-alert-close]').click()
    await expect(image.locator('[data-image-alert]')).toHaveCount(0)
    expectNoUnexpectedPageErrors(pageErrors)
})

test('images island opens and navigates its native image preview', async ({ page }) => {
    const pageErrors = capturePageErrors(page)
    await openFixture(page)

    await page.locator('#images-wrapper [data-images-preview]').first().click()
    const dialog = page.locator('[data-images-dialog]')
    await expect(dialog).toBeVisible()
    await expect(dialog.locator('.soa-images-dialog__position')).toHaveText('1 / 2')
    await dialog.locator('[data-images-dialog-next]').click()
    await expect(dialog.locator('.soa-images-dialog__image')).toHaveAttribute(
        'src',
        /\/fixtures\/second\.svg$/,
    )
    await expect(dialog.locator('.soa-images-dialog__position')).toHaveText('2 / 2')
    await dialog.locator('[data-images-dialog-close]').click()
    await expect(dialog).not.toBeVisible()
    expectNoUnexpectedPageErrors(pageErrors)
})

test('images island applies sortable order and destroys both drivers', async ({ page }) => {
    const pageErrors = capturePageErrors(page)
    await openFixture(page)
    await page.evaluate(() => {
        const host = globalThis.document.querySelector('#images-wrapper')
        const gallery = host.querySelector('[data-images-gallery]')
        const sortableKey = Object.keys(gallery).find((key) => key.startsWith('Sortable'))
        gallery[sortableKey].options.onEnd({ newDraggableIndex: 1, oldDraggableIndex: 0 })
    })
    await expect(page.locator('#images-wrapper [data-images-value]')).toHaveValue(
        'fixtures/second.svg,fixtures/pixel.svg',
    )
    const result = await page.evaluate(() => {
        const host = globalThis.document.querySelector('#images-wrapper')
        const gallery = host.querySelector('[data-images-gallery]')
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

    await expect(page.locator('#only-link-images [data-images-upload]')).toHaveCount(0)
    await page.locator('#only-link-images [data-images-insert-new]').click()
    await expect(page.locator('#only-link-images [data-images-value]')).toHaveValue('')
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

    await page.locator('#images-wrapper [data-images-insert]').first().click()
    await expect(page.locator('#images-wrapper [data-images-value]')).toHaveValue(
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
        const button = host.querySelector('[data-file-upload]')

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
        const button = host.querySelector('[data-image-upload]')
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

    await expect(page.locator('#only-link-image [data-image-upload]')).toHaveCount(0)
    await page.locator('#only-link-image [data-image-insert-new]').click()
    await expect(page.locator('#only-link-image [data-image-value]')).toHaveValue('')
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

    await page.locator('#image-wrapper [data-image-insert-new]').click()
    await expect(page.locator('#image-wrapper [data-image-value]')).toHaveValue(
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
    await expectSingleSelectBehavior(page)
    await expectMultipleSelectBehavior(page)
    await expectSelectChangeEvents(page)
    await expectReadonlyRequiredSelect(page)
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
