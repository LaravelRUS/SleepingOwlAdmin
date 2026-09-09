const PASTE_BUFFER_ID = 'image-paste-in-buffer'

export function readImagePasteBuffer(document) {
    const element = findImagePasteBuffer(document)
    if (!element?.src) return null

    return {
        dataUrl: element.src,
        extension: element.dataset.ext || 'jpg',
    }
}

export function createImagePasteBody(buffer, dependencies = {}) {
    const now = dependencies.now ?? Date.now
    const FormDataType = dependencies.FormDataType ?? globalThis.FormData
    const filename = `${now()}.${buffer.extension || 'jpg'}`
    const file = dataUrlToFile(buffer.dataUrl, filename, dependencies)
    const body = new FormDataType()

    body.append('file', file, filename)

    return body
}

export function dataUrlToFile(dataUrl, filename, dependencies = {}) {
    const decode = dependencies.decode ?? globalThis.atob
    const FileType = dependencies.FileType ?? globalThis.File
    const [metadata, payload] = String(dataUrl).split(',', 2)
    const mime = metadata.match(/^data:([^;]+);base64$/)?.[1]

    if (!mime || payload === undefined) throw new TypeError('Invalid image data URL.')

    const binary = decode(payload)
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))

    return new FileType([bytes], filename, { type: mime })
}

export function removeImagePasteBuffer(document, revokeObjectUrl = defaultRevoke) {
    const element = findImagePasteBuffer(document)
    if (!element) return false

    if (element.name && typeof revokeObjectUrl === 'function') {
        revokeObjectUrl(element.name)
    }
    element.remove()

    return true
}

function findImagePasteBuffer(document) {
    return document?.getElementById(PASTE_BUFFER_ID) ?? null
}

function defaultRevoke(url) {
    globalThis.URL?.revokeObjectURL?.(url)
}
