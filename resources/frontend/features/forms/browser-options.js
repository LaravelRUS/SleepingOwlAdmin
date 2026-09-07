export function formButtonQuestions(target) {
    return {
        delete: translate(target, 'lang.table.delete-confirm', 'Delete?'),
        destroy: translate(target, 'lang.table.destroy-confirm', 'Destroy?'),
    }
}

export function fileNotifications(target) {
    return {
        promptLink: (url) => promptFileLink(target, url),
        uploadError: (response) => showUploadError(target, response),
    }
}

function promptFileLink(target, url) {
    const title = translate(target, 'lang.file.insert_link', 'Insert link')

    return target.Admin.Messages.prompt(title, null, null, url, url).then((result) => result?.value)
}

function showUploadError(target, response) {
    const error = Array.isArray(response?.errors) ? response.errors[0] : null
    if (error) return target.Admin.Messages.error(response.message, error)

    const message = translate(target, 'lang.ckeditor.upload.error.common', 'Upload error')

    return target.Admin.Messages.error(message)
}

function translate(target, key, fallback) {
    if (typeof target.trans !== 'function') return fallback

    const value = target.trans(key)

    return typeof value === 'string' && value !== key ? value : fallback
}
