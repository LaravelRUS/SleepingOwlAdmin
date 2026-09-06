import { filePresentation } from './files-values.js'

export function createFileItem(source, response) {
    const item = cloneFileItem(source)
    const file = filePresentation(response)

    fillFileInfo(item, file)
    fillPreview(item, file)
    fillFields(item, file)
    fillLinks(item, file)

    return item
}

function cloneFileItem(source) {
    const fragment = templateFragment(source)
    const item = fragment.querySelector('.fileThumbnail') ?? fragment.firstElementChild

    if (!item) throw new TypeError('Files template must contain a root element.')

    return item
}

function templateFragment(source) {
    if (hasTemplateContent(source)) return source.content.cloneNode(true)

    const template = source?.ownerDocument.createElement('template')
    if (!template) throw new TypeError('Files template must be a DOM element.')
    template.innerHTML = source.textContent ?? source.innerHTML ?? ''

    return template.content.cloneNode(true)
}

function hasTemplateContent(source) {
    return typeof source?.content?.cloneNode === 'function'
}

function fillFileInfo(item, file) {
    const info = item.querySelector('[data-id="file"]')
    if (!info) return

    info.dataset.src = file.src
    info.dataset.url = file.url
    info.textContent = file.basename
}

function fillPreview(item, file) {
    const icon = item.querySelector('.fileicon-inner')
    const extension = item.querySelector('.file-extension')
    const mime = item.querySelector('.file-mime')

    if (icon) icon.style.backgroundImage = file.image ? cssUrl(file.url) : ''
    if (extension) extension.textContent = file.extension
    if (mime) mime.textContent = ''
}

function fillFields(item, file) {
    setValue(item, '[data-id="title"]', file.title)
    setValue(item, '[data-id="description"]', file.description)
    setValue(item, '[data-id="original_name"]', file.originalName)

    const originalName = item.querySelector('.file-original_name')
    if (originalName) originalName.textContent = file.originalName
}

function fillLinks(item, file) {
    const preview = item.querySelector('.file-image')
    if (preview) {
        preview.href = file.image ? file.url : ''
        preview.hidden = !file.image
    }

    const download = item.querySelector('a[download]')
    if (download) download.href = file.url
}

function setValue(root, selector, value) {
    const field = root.querySelector(selector)
    if (field) field.value = value
}

export function cssUrl(value) {
    return `url(${JSON.stringify(String(value))})`
}
