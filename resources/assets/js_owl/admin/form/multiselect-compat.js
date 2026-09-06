import Multiselect from 'vue-multiselect'
import { asNativeVue3Component } from '../../libs/vue-compat-config'

export const NativeMultiselect = asNativeVue3Component(Multiselect, {
    ATTR_ENUMERATED_COERCION: 'suppress-warning',
})
