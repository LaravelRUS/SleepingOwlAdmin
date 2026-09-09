export function createImageUpload(Upload, element, config) {
    return new Upload(element, imageUploadOptions(config))
}

export function imageUploadOptions(config) {
    return {
        url: config.url,
        method: 'POST',
        uploadMultiple: false,
        previewsContainer: false,
        acceptedFiles: 'image/*',
        dictDefaultMessage: '',
        maxFilesize: config.maxFileSize,
        dictFileTooBig: config.fileTooBigText,
        dictInvalidFileType: config.invalidFileTypeText,
        dictResponseError: config.responseErrorText,
        headers: { 'X-CSRF-TOKEN': config.csrfToken },
        sending: config.onSending,
        success: (_file, response) => config.onSuccess(response),
        error: (_file, response) => config.onError(response),
        complete: config.onComplete,
    }
}

export async function postPastedImage(http, url, body) {
    const response = await http.post(url, body)

    return response.json()
}

export async function imageUploadError(error, fallbackTitle) {
    const response = error?.response
    const data = await responseData(response)
    const validationError = Array.isArray(data.errors) ? data.errors[0] : null

    if (validationError) {
        return { title: data.message || fallbackTitle, message: validationError }
    }
    if (!response) return { title: fallbackTitle, message: '' }

    return {
        title: statusTitle(response, fallbackTitle),
        message: data.message || '',
    }
}

async function responseData(response) {
    if (typeof response?.json !== 'function') return {}

    try {
        return await response.json()
    } catch {
        return {}
    }
}

function statusTitle(response, fallbackTitle) {
    const status = response.status ? `(${response.status})` : ''

    return [response.statusText || fallbackTitle, status].filter(Boolean).join(' ')
}
