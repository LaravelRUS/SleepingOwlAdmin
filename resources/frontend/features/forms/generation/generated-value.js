export const DEFAULT_GENERATED_CHARACTERS =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function generateFieldValue(field, random = Math.random) {
    const characters = field.dataset.generateChars || DEFAULT_GENERATED_CHARACTERS
    const length = positiveInteger(field.dataset.generateLength, 8)

    return Array.from({ length }, () => randomCharacter(characters, random)).join('')
}

function randomCharacter(characters, random) {
    const index = Math.floor(random() * characters.length)

    return characters.charAt(Math.min(index, characters.length - 1))
}

function positiveInteger(value, fallback) {
    const number = Number.parseInt(value, 10)

    return Number.isInteger(number) && number > 0 ? number : fallback
}
