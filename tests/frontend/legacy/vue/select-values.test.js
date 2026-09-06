import { describe, expect, it } from 'vitest'

import {
    appendSelectTag,
    copySelectOptions,
    findSelectOption,
    initialSelectValue,
    isSelectOptionSelected,
    selectFormValue,
    selectedOptionIds,
} from '../../../../resources/assets/js_owl/admin/form/select-values'

const options = [
    { id: null, text: 'None' },
    { id: 1, text: 'One' },
    { id: '2', text: 'Two' },
    { id: 'code', text: 'Code' },
]

describe('select values', () => {
    it('copies option objects without mutating server props', () => {
        const copied = copySelectOptions(options)

        expect(copied).toEqual(options)
        expect(copied).not.toBe(options)
        expect(copied[0]).not.toBe(options[0])
    })

    it('prefers typed ids and falls back to form-compatible numeric matching', () => {
        expect(findSelectOption(options, '1')).toBe(options[1])
        expect(findSelectOption(options, 2)).toBe(options[2])
        expect(findSelectOption(options, null)).toBe(options[0])
        expect(findSelectOption(options, 'missing')).toBeNull()
    })

    it('prepares single and multiple values without losing id types', () => {
        expect(initialSelectValue(options, 2, false)).toBe(options[2])

        const selection = initialSelectValue(options, ['code', '1'], true)
        expect(selectedOptionIds(selection, true)).toEqual([1, 'code'])
        expect(isSelectOptionSelected(selection, '1', true)).toBe(true)
        expect(isSelectOptionSelected(selection, null, true)).toBe(false)
    })

    it('keeps null distinct from an empty string at the selection boundary', () => {
        const values = [...options, { id: '', text: 'Empty' }]

        expect(findSelectOption(values, null)?.text).toBe('None')
        expect(findSelectOption(values, '')?.text).toBe('Empty')
        expect(selectFormValue(null)).toBe('')
        expect(selectFormValue('code')).toBe('code')
    })

    it('adds a tag once and reuses an existing typed-equivalent option', () => {
        const selected = [options[1]]
        const tagged = appendSelectTag(options, selected, 'custom')
        const duplicate = appendSelectTag(tagged.options, tagged.selection, '1')

        expect(tagged.options.at(-1)).toEqual({ id: 'custom', text: 'custom' })
        expect(selectedOptionIds(tagged.selection, true)).toEqual([1, 'custom'])
        expect(duplicate.options).toBe(tagged.options)
        expect(duplicate.selection).toBe(tagged.selection)
    })
})
