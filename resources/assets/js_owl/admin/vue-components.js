import EnvEditor from './display/env-editor.vue'
import Deselect from './form/deselect'
import ElementFile from './form/file.vue'
import ElementImage from './form/image.vue'
import ElementImages from './form/images'
import { LegacyMultiselect } from './form/multiselect-compat'
import { RelatedElements, RelatedGroup } from './form/related'
import { asNativeVue3Component } from '../libs/vue-compat-config'

export const legacyVueComponents = Object.freeze({
    deselect: Deselect,
    'element-file': asNativeVue3Component(ElementFile),
    'element-image': asNativeVue3Component(ElementImage),
    'element-images': asNativeVue3Component(ElementImages),
    env_editor: asNativeVue3Component(EnvEditor),
    multiselect: LegacyMultiselect,
    'related-elements': RelatedElements,
    'related-group': RelatedGroup,
})
