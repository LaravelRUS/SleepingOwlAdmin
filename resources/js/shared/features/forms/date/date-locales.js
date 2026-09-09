import de from 'air-datepicker/locale/de'
import en from 'air-datepicker/locale/en'
import ru from 'air-datepicker/locale/ru'
import uk from 'air-datepicker/locale/uk'
import zh from 'air-datepicker/locale/zh'

const DATE_PICKER_LOCALES = Object.freeze({ de, en, ru, uk, zh })

export function resolveDatePickerLocale(locale) {
    const normalized = normalizeLocale(locale)

    return DATE_PICKER_LOCALES[normalized] ?? en
}

function normalizeLocale(locale) {
    const value = String(locale ?? 'en').toLowerCase()
    if (value.startsWith('zh')) return 'zh'

    return value.split(/[-_]/, 1)[0]
}
