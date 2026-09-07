import { downloadFile } from '../file-download.js'
import { createFileItem, cssUrl } from './files-template.js'
import { createFilesUploader } from './files-uploader.js'
import { serializeFiles } from './files-values.js'

export const FILES_COMPONENT = 'files'
export const FILES_SELECTOR = '.fileUploadMultiple'

export function createFilesDefinition(dependencies) {
    const settings = normalizeDependencies(dependencies)

    return {
        mount: (element) => mountFiles(element, settings),
        name: FILES_COMPONENT,
        selector: FILES_SELECTOR,
    }
}

export function mountFiles(element, dependencies) {
    const settings = normalizeDependencies(dependencies)
    const state = createState(element, settings)
    const removeListeners = bindFiles(state)
    const sortable = createSortable(state)
    const uploader = createUploader(state)
    syncValue(state, false)

    return {
        destroy: () => destroyFiles(removeListeners, sortable, uploader),
        sync: () => syncValue(state, false),
        upload: (files) => uploader?.enqueue(files) ?? Promise.resolve([]),
    }
}

function createState(element, dependencies) {
    return {
        browse: element.querySelector('.fileBrowse'),
        dependencies,
        element,
        group: element.querySelector('.files-group'),
        input: element.querySelector('.fileValue'),
        spinner: element.querySelector('.fileBrowse .fa-spin'),
        template: element.querySelector('.RenderFile'),
    }
}

function bindFiles(state) {
    const change = (event) => handleFieldChange(state, event)
    const click = (event) => handleClick(state, event)
    state.element.addEventListener('change', change)
    state.element.addEventListener('click', click)

    return () => {
        state.element.removeEventListener('change', change)
        state.element.removeEventListener('click', click)
    }
}

function handleFieldChange(state, event) {
    if (event.target.matches('.tit, .desc')) syncValue(state, true)
}

function handleClick(state, event) {
    const remove = event.target.closest('.fileRemove')
    const link = event.target.closest('.fileLink')
    const download = event.target.closest('a[download]')
    if (remove && state.element.contains(remove)) removeFile(state, event, remove)
    if (link && state.element.contains(link)) editFileLink(state, event, link)
    if (download && state.element.contains(download)) downloadCurrentFile(state, event, download)
}

function downloadCurrentFile(state, event, control) {
    event.preventDefault()
    downloadFile(control.href, { document: state.element.ownerDocument }).catch((error) => {
        dispatch(state.element, 'files:download-failed', { error })
    })
}

function removeFile(state, event, control) {
    event.preventDefault()
    control.closest('.fileThumbnail')?.remove()
    syncValue(state, true)
}

function editFileLink(state, event, control) {
    event.preventDefault()
    const item = control.closest('.thumbnail')
    state.dependencies.notifications
        .promptLink(control.getAttribute('href') ?? '')
        .then((value) => {
            if (!value || !item?.isConnected) return
            replaceFileLink(item, value)
            syncValue(state, true)
        })
}

function replaceFileLink(item, value) {
    const info = item.querySelector('[data-id="file"]')
    if (info) info.dataset.src = value
    const preview = item.querySelector('.file-image')
    if (preview) preview.href = value
    const download = item.querySelector('a[download]')
    if (download) download.href = value
    const icon = item.querySelector('.fileicon-inner')
    if (icon) icon.style.backgroundImage = cssUrl(value)
}

function createUploader(state) {
    if (!state.browse || !state.group || !state.template || !state.element.dataset.target) {
        return null
    }

    return createFilesUploader({
        browse: state.browse,
        http: state.dependencies.http,
        onBusy: (busy) => setBusy(state, busy),
        onError: (payload, error) => uploadFailed(state, payload, error),
        onSuccess: (payload) => uploadSucceeded(state, payload),
        target: state.element.dataset.target,
        token: state.element.dataset.token,
    })
}

function uploadSucceeded(state, payload) {
    try {
        state.group?.append(createFileItem(state.template, payload))
        syncValue(state, true)
        dispatch(state.element, 'files:uploaded', { file: payload })
    } catch (error) {
        uploadFailed(state, null, error)
    }
}

function uploadFailed(state, payload, error) {
    state.dependencies.notifications.uploadError(payload, error)
    dispatch(state.element, 'files:failed', { error, response: payload })
}

function createSortable(state) {
    if (!state.group || !isEnabled(state.group.dataset.draggable)) return null

    return state.dependencies.sortable.create(state.group, {
        handle: '.drag-handle',
        onUpdate: () => syncValue(state, true),
    })
}

function syncValue(state, notify) {
    if (!state.input) return ''

    state.input.value = serializeFiles(state.element)
    if (notify) dispatch(state.element, 'files:changed', { value: state.input.value })

    return state.input.value
}

function setBusy(state, busy) {
    state.element.setAttribute('aria-busy', String(busy))
    if (state.spinner) state.spinner.style.display = busy ? 'inline-block' : 'none'
}

function destroyFiles(removeListeners, sortable, uploader) {
    removeListeners()
    sortable?.destroy()
    uploader?.destroy()
}

function dispatch(element, name, detail) {
    element.dispatchEvent(new globalThis.CustomEvent(name, { bubbles: true, detail }))
}

function isEnabled(value) {
    return value === '1' || value === 'true'
}

function normalizeDependencies(input) {
    assertFunction(input?.http?.post, 'Files require Admin.Http.')
    assertFunction(input?.sortable?.create, 'Files require Sortable.')

    return {
        http: input.http,
        notifications: normalizeNotifications(input.notifications),
        sortable: input.sortable,
    }
}

function normalizeNotifications(input = {}) {
    return {
        promptLink: input.promptLink ?? (() => Promise.resolve(null)),
        uploadError: input.uploadError ?? (() => {}),
    }
}

function assertFunction(value, message) {
    if (typeof value !== 'function') throw new TypeError(message)
}
