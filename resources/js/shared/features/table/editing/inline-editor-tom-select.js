import TomSelect from 'tom-select'

const NATIVE_SELECT_SELECTOR = '[data-inline-editor-select-native]'

export function createInlineEditorTomSelect(
    element,
    config,
    createTomSelect = createTomSelectInstance,
) {
    const select = requiredSelect(element)
    select.value = config.value

    if (config.mode !== 'popup') return createNativeSelectControl(select)

    const tomSelect = createTomSelect(select, {
        allowEmptyOption: true,
        closeAfterSelect: true,
        create: false,
        maxItems: 1,
        maxOptions: null,
        plugins: [],
    })

    return {
        clear: () => tomSelect.clear(),
        destroy: () => tomSelect.destroy(),
        focusElement: () => tomSelect.focus(),
        read: () => selectValue(tomSelect.getValue()),
        setDisabled: (disabled) => tomSelect[disabled ? 'disable' : 'enable'](),
    }
}

function createTomSelectInstance(select, settings) {
    return new TomSelect(select, settings)
}

function createNativeSelectControl(select) {
    return {
        clear: () => {
            select.value = ''
            select.dispatchEvent(new globalThis.Event('change', { bubbles: true }))
        },
        focusElement: select,
        read: () => select.value,
    }
}

function requiredSelect(element) {
    const select = element.querySelector(NATIVE_SELECT_SELECTOR)
    if (!select) throw new TypeError('Inline editor select template requires a native select.')

    return select
}

function selectValue(value) {
    if (Array.isArray(value)) return value[0] ?? ''

    return String(value ?? '')
}
