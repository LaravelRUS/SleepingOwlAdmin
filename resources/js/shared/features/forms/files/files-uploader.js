export function createFilesUploader(options) {
    const state = createState(options)
    const removeListeners = bindUploader(state)

    return {
        destroy: () => destroyUploader(state, removeListeners),
        enqueue: (files) => enqueueFiles(state, files),
        input: state.input,
    }
}

function createState(options) {
    assertOptions(options)
    const input = options.browse.ownerDocument.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.hidden = true
    input.tabIndex = -1
    options.browse.append(input)

    return {
        ...options,
        abortController: null,
        destroyed: false,
        input,
        pending: 0,
        queue: Promise.resolve(),
    }
}

function bindUploader(state) {
    const removers = [
        listen(state.browse, 'click', (event) => openPicker(state, event)),
        listen(state.browse, 'keydown', (event) => openPickerFromKeyboard(state, event)),
        listen(state.browse, 'dragover', preventDefault),
        listen(state.browse, 'drop', (event) => receiveDrop(state, event)),
        listen(state.input, 'change', () => enqueueFiles(state, state.input.files)),
    ]
    makeBrowseAccessible(state.browse)

    return () => removers.reverse().forEach((remove) => remove())
}

function enqueueFiles(state, input) {
    const files = [...(input ?? [])]
    if (files.length === 0 || state.destroyed) return Promise.resolve([])

    changePending(state, 1)
    const request = state.queue.catch(() => {}).then(() => uploadFiles(state, files))
    state.queue = request

    return request.finally(() => changePending(state, -1))
}

async function uploadFiles(state, files) {
    const results = []
    for (const file of files) {
        const result = await uploadFile(state, file)
        if (result) results.push(result)
    }

    return results
}

async function uploadFile(state, file) {
    state.abortController = new globalThis.AbortController()
    try {
        const response = await state.http.post(state.target, uploadBody(state, file), {
            signal: state.abortController.signal,
        })
        const payload = await response.json()
        if (!state.destroyed) state.onSuccess(payload, file)

        return payload
    } catch (error) {
        if (!state.destroyed && error?.name !== 'AbortError') {
            state.onError(await errorPayload(error), error, file)
        }

        return null
    } finally {
        state.abortController = null
    }
}

function uploadBody(state, file) {
    const FormData = state.browse.ownerDocument.defaultView?.FormData ?? globalThis.FormData
    const body = new FormData()
    body.append('file', file, file.name)
    if (state.token) body.append('_token', state.token)

    return body
}

async function errorPayload(error) {
    try {
        return (await error?.response?.json?.()) ?? null
    } catch {
        return null
    }
}

function receiveDrop(state, event) {
    event.preventDefault()
    enqueueFiles(state, event.dataTransfer?.files)
}

function openPicker(state, event) {
    if (event.target === state.input) return
    event.preventDefault()
    state.input.click()
}

function openPickerFromKeyboard(state, event) {
    if (!['Enter', ' '].includes(event.key)) return
    event.preventDefault()
    state.input.click()
}

function changePending(state, amount) {
    state.pending += amount
    state.onBusy(state.pending > 0)
    if (state.pending === 0) state.input.value = ''
}

function destroyUploader(state, removeListeners) {
    state.destroyed = true
    state.abortController?.abort()
    removeListeners()
    state.input.remove()
    state.onBusy(false)
}

function makeBrowseAccessible(browse) {
    if (!browse.hasAttribute('role')) browse.setAttribute('role', 'button')
    if (!browse.hasAttribute('tabindex')) browse.tabIndex = 0
}

function preventDefault(event) {
    event.preventDefault()
}

function listen(target, name, listener) {
    target.addEventListener(name, listener)

    return () => target.removeEventListener(name, listener)
}

function assertOptions(options) {
    assertPresent(options?.browse?.ownerDocument, 'Files uploader requires browse.')
    assertFunction(options?.http?.post, 'Files uploader requires Admin.Http.')
    if (typeof options.target !== 'string' || options.target.length === 0) {
        throw new TypeError('Files uploader target must be a non-empty string.')
    }
}

function assertPresent(value, message) {
    if (!value) throw new TypeError(message)
}

function assertFunction(value, message) {
    if (typeof value !== 'function') throw new TypeError(message)
}
