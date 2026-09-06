import jQuery from 'jquery'
import moment from 'moment'

export function createLegacyFilterEventBridge() {
    return {
        bindDateChange,
        bindSyntheticChange,
        parseDate: (value, format) => moment(value, format),
    }
}

function bindDateChange(input, listener) {
    const container = input.closest('.input-date')

    if (container) {
        jQuery(container).on('dp.change', listener)
    }
}

function bindSyntheticChange(input, listener) {
    jQuery(input).on('change', (event) => {
        if (!event.originalEvent) listener()
    })
}
