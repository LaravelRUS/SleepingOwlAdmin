export function normalizeImageValue(value) {
    return value === null || value === undefined ? '' : String(value)
}

export function isBlobImageValue(value) {
    return normalizeImageValue(value).startsWith('blob:')
}

export function imagePreviewUrl(value, options) {
    const normalized = normalizeImageValue(value)

    if (isExternalImageValue(normalized)) return normalized
    if (options.useAssetPrefix && options.assetPrefix) {
        return `${options.assetPrefix}${normalized}`
    }

    return options.createUploadUrl(normalized)
}

function isExternalImageValue(value) {
    return value.startsWith('http') || value.startsWith('blob:')
}
