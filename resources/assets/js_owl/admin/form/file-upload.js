export function createFileUpload(Upload, element, config) {
    return new Upload(element, fileUploadOptions(config))
}

export function fileUploadOptions(config) {
    return {
        url: config.url,
        method: 'POST',
        uploadMultiple: false,
        previewsContainer: false,
        dictDefaultMessage: '',
        maxFilesize: config.maxFileSize,
        dictFileTooBig: config.fileTooBigText,
        dictResponseError: config.responseErrorText,
        headers: { 'X-CSRF-TOKEN': config.csrfToken },
        sending: config.onSending,
        success: (_file, response) => config.onSuccess(response),
        error: (_file, response) => config.onError(response),
        complete: config.onComplete,
    }
}

export function responseErrors(response) {
    return Array.isArray(response?.errors) ? response.errors : []
}
