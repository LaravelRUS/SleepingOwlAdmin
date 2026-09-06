export function normalizeFileValue(value) {
    return value === null || value === undefined ? '' : String(value)
}

export function fileDownloadUrl(value, createUploadUrl) {
    const normalized = normalizeFileValue(value)

    return normalized.startsWith('http') ? normalized : createUploadUrl(normalized)
}
