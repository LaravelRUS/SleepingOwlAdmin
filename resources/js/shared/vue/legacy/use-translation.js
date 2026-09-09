import { inject } from 'vue'

import { requireVueTranslation, vueTranslationKey } from './translation'

export function useTranslation() {
    return requireVueTranslation(inject(vueTranslationKey, null))
}
