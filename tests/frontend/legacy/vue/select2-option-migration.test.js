import { expect, it, vi } from 'vitest'

import { normalizeLegacySelect2Options } from '../../../../resources/js/shared/legacy/admin/form/select2-option-migration.js'

it('maps supported Select2 options onto the Vue Multiselect contract', () => {
    expect(
        normalizeLegacySelect2Options({
            allowClear: false,
            disabled: 'true',
            maximumSelectionLength: '4',
            minimumInputLength: 2,
            placeholder: 'Choose a project',
            tags: true,
        }),
    ).toEqual({
        allowEmpty: false,
        max: 4,
        minSymbols: 2,
        placeholder: 'Choose a project',
        readonly: true,
        taggable: true,
    })
})

it('warns for unsafe, plugin-specific and unknown raw options', () => {
    const warn = vi.fn()

    normalizeLegacySelect2Options(
        {
            ajax: { url: '/legacy' },
            escapeMarkup: false,
            theme: 'bootstrap4',
        },
        { warn },
    )

    expect(warn).toHaveBeenCalledTimes(3)
    expect(warn.mock.calls.flat().join('\n')).toContain('Use SelectAjax or MultiSelectAjax')
    expect(warn.mock.calls.flat().join('\n')).toContain('HTML labels are no longer executed')
    expect(warn.mock.calls.flat().join('\n')).toContain('custom-island API')
})
