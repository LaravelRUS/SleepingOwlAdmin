export function createLegacyInlineEditor(root = globalThis) {
    const jquery = root.jQuery

    assertDependencies(jquery)

    return {
        scan(container = root.document) {
            const standard = unmountedElements(container, '.inline-editable', jquery)
            const dateTime = unmountedElements(container, '.dt-editable', jquery)
            const date = unmountedElements(container, '.dat-editable', jquery)

            mountStandardEditors(standard, jquery, root.trans)
            mountDateEditors([...dateTime, ...date], jquery, root.trans)
            bindPicker(dateTime, '.datatime-editable', 'datetime_format', jquery, root)
            bindPicker(date, '.date-editable', 'date_format', jquery, root)

            return standard.length + dateTime.length + date.length
        },
    }
}

export function mapInlineEditSuccess(response, translate) {
    if (response.status !== 'true' && response.status !== true) {
        return response.reason || translate('lang.table.error')
    }

    if (response.newValue !== undefined) {
        return { newValue: response.newValue }
    }
}

export function mapInlineEditError(response, translate) {
    return response.status === 500 ? translate('lang.table.error') : response.responseText
}

function mountStandardEditors(elements, jquery, translate) {
    jquery(elements).editable({
        error: (response) => mapInlineEditError(response, translate),
        success: (response) => mapInlineEditSuccess(response, translate),
    })
}

function mountDateEditors(elements, jquery, translate) {
    jquery(elements).editable({
        error: (response) => mapInlineEditError(response, translate),
        onblur: 'ignore',
    })
}

function bindPicker(elements, selector, formatKey, jquery, root) {
    jquery(elements)
        .off('shown.soa-inline-edit')
        .on('shown.soa-inline-edit', () => {
            jquery(selector).datetimepicker(pickerOptions(root, formatKey))
        })
}

function pickerOptions(root, formatKey) {
    return {
        format: root.Admin.Config.get(formatKey),
        icons: {
            clear: 'far fa-calendar-times',
            close: 'fas fa-times',
            date: 'far fa-calendar-alt',
            down: 'fas fa-arrow-down',
            next: 'fas fa-arrow-right',
            previous: 'fas fa-arrow-left',
            time: 'fas fa-clock',
            today: 'fas fa-calendar-week',
            up: 'fas fa-arrow-up',
        },
        locale: root.Admin.locale,
    }
}

function unmountedElements(root, selector, jquery) {
    return matchingElements(root, selector).filter((element) => !jquery(element).data('editable'))
}

function matchingElements(root, selector) {
    const elements = [...root.querySelectorAll(selector)]
    if (typeof root.matches === 'function' && root.matches(selector)) {
        elements.unshift(root)
    }

    return elements
}

function assertDependencies(jquery) {
    if (typeof jquery?.fn?.editable !== 'function') {
        throw new TypeError('The legacy AdminLTE inline editor requires X-editable.')
    }

    if (typeof jquery?.fn?.datetimepicker !== 'function') {
        throw new TypeError('The legacy AdminLTE inline editor requires DateTimePicker.')
    }
}
