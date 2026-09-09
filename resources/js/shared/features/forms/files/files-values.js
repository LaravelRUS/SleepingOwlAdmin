const FILE_SELECTOR = '[data-id="file"]'
const TITLE_SELECTOR = '[data-id="title"]'
const DESCRIPTION_SELECTOR = '[data-id="description"]'
const ORIGINAL_NAME_SELECTOR = '[data-id="original_name"]'

export function collectFiles(root) {
    return [...root.querySelectorAll('.thumbnail')].map(readFile)
}

export function serializeFiles(root) {
    return JSON.stringify(collectFiles(root))
}

export function readFile(thumbnail) {
    const file = thumbnail.querySelector(FILE_SELECTOR)

    return {
        url: file?.dataset.src ?? '',
        title: fieldValue(thumbnail, TITLE_SELECTOR),
        desc: fieldValue(thumbnail, DESCRIPTION_SELECTOR),
        orig: fieldValue(thumbnail, ORIGINAL_NAME_SELECTOR),
    }
}

export function filePresentation(response) {
    const src = requiredString(response?.value, 'Uploaded file response value')
    const extension = fileExtension(src)

    return {
        basename: baseName(src),
        description: optionalString(response?.desc),
        extension: isImageExtension(extension) ? '' : extension,
        image: isImageExtension(extension),
        originalName: optionalString(response?.original_name),
        src,
        title: optionalString(response?.title),
        url: optionalString(response?.path) || `/${src}`,
    }
}

export function baseName(value) {
    const name = String(value).split(/[\\/]/).pop() ?? ''
    const extensionIndex = name.lastIndexOf('.')

    return extensionIndex > 0 ? name.slice(0, extensionIndex) : name
}

export function fileExtension(value) {
    const clean = String(value).split(/[?#]/, 1)[0]
    const name = clean.split(/[\\/]/).pop() ?? ''
    const extensionIndex = name.lastIndexOf('.')

    return extensionIndex > -1 ? name.slice(extensionIndex + 1).toLowerCase() : ''
}

export function isImageExtension(extension) {
    return ['gif', 'jpeg', 'jpg', 'png', 'svg', 'tiff', 'webp'].includes(extension)
}

function fieldValue(root, selector) {
    return root.querySelector(selector)?.value ?? ''
}

function optionalString(value) {
    return typeof value === 'string' ? value : ''
}

function requiredString(value, name) {
    if (typeof value !== 'string' || value.length === 0) {
        throw new TypeError(`${name} must be a non-empty string.`)
    }

    return value
}
