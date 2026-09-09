import { normalizeImageValue } from './image-value'

export function normalizeImagesValues(values) {
    if (!Array.isArray(values)) return []

    return values.map(normalizeImageValue).filter(Boolean)
}

export function addImageValue(values, value) {
    const normalized = normalizeImageValue(value)

    return normalized ? [...values, normalized] : values
}

export function replaceImageValue(values, index, value) {
    if (!hasImageIndex(values, index)) return values

    const normalized = normalizeImageValue(value)
    if (!normalized) return values

    return values.map((current, position) => (position === index ? normalized : current))
}

export function removeImageValue(values, index) {
    if (!hasImageIndex(values, index)) return values

    return values.filter((_value, position) => position !== index)
}

export function reorderImageValues(values, from, to) {
    if (!hasImageIndex(values, from) || !hasImageIndex(values, to) || from === to) {
        return values
    }

    const reordered = [...values]
    const [moved] = reordered.splice(from, 1)
    reordered.splice(to, 0, moved)

    return reordered
}

export function serializeImagesValues(values) {
    return values.join(',')
}

function hasImageIndex(values, index) {
    return Number.isInteger(index) && index >= 0 && index < values.length
}
