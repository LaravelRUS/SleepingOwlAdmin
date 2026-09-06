import EnvEditor from './display/env-editor.vue'
import Deselect from './form/deselect'
import ElementFile from './form/file'
import ElementImage from './form/image'
import ElementImages from './form/images'
import { LegacyMultiselect } from './form/multiselect-compat'
import { RelatedElements, RelatedGroup } from './form/related'

export const legacyVueComponents = Object.freeze({
    deselect: Deselect,
    'element-file': ElementFile,
    'element-image': ElementImage,
    'element-images': ElementImages,
    env_editor: EnvEditor,
    multiselect: LegacyMultiselect,
    'related-elements': RelatedElements,
    'related-group': RelatedGroup,
})
