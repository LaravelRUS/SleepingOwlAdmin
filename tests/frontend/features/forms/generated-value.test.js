import { expect, it } from 'vitest'

import {
    DEFAULT_GENERATED_CHARACTERS,
    generateFieldValue,
} from '../../../../resources/frontend/features/forms/generation/generated-value.js'

it('generates the configured length from custom characters', () => {
    const field = { dataset: { generateChars: 'ab', generateLength: '4' } }

    expect(generateFieldValue(field, () => 0)).toBe('aaaa')
    expect(generateFieldValue(field, () => 0.99)).toBe('bbbb')
})

it('falls back to a safe length and character set', () => {
    const field = { dataset: { generateChars: '', generateLength: 'invalid' } }
    const value = generateFieldValue(field, () => 0)

    expect(value).toHaveLength(8)
    expect(DEFAULT_GENERATED_CHARACTERS).toContain(value[0])
})
