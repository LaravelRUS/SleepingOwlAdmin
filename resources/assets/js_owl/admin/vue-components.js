import ElementFile from './form/file.vue'
import ElementImage from './form/image.vue'
import ElementImages from './form/images'
import ElementSelect from './form/select.vue'
import { RelatedElements } from './form/related'

export const vueComponents = Object.freeze({
    'element-file': ElementFile,
    'element-image': ElementImage,
    'element-images': ElementImages,
    'element-select': ElementSelect,
    'related-elements': RelatedElements,
})
