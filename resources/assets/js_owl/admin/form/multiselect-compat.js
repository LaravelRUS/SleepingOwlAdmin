import { h } from 'vue'
import Multiselect from 'vue-multiselect'
import { asNativeVue3Component } from '../../libs/vue-compat-config'

export const NativeMultiselect = asNativeVue3Component(Multiselect, {
    ATTR_ENUMERATED_COERCION: 'suppress-warning',
})

export const LegacyMultiselect = {
    name: 'LegacyMultiselect',
    inheritAttrs: false,
    compatConfig: {
        RENDER_FUNCTION: false,
    },
    props: {
        value: {
            default: null,
        },
    },
    emits: ['input'],
    methods: {
        updateValue(value) {
            this.$emit('input', value)
        },
    },
    render() {
        return h(
            NativeMultiselect,
            {
                ...this.$attrs,
                modelValue: this.value,
                'onUpdate:modelValue': this.updateValue,
            },
            this.$slots,
        )
    },
}
