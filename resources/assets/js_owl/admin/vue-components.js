import EnvEditor from './display/env-editor.vue'
import ElementFile from './form/file.vue'
import ElementImage from './form/image.vue'
import ElementImages from './form/images'
import ElementSelect from './form/select.vue'
import { RelatedElements } from './form/related'
import { asNativeVue3Component } from '../libs/vue-compat-config'

export const legacyVueComponents = Object.freeze({
    'element-file': asNativeVue3Component(ElementFile),
    'element-image': asNativeVue3Component(ElementImage),
    'element-images': asNativeVue3Component(ElementImages),
    'element-select': asNativeVue3Component(ElementSelect),
    env_editor: asNativeVue3Component(EnvEditor),
    'related-elements': asNativeVue3Component(RelatedElements),
})
