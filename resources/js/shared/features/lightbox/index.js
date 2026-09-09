export const LIGHTBOX_FEATURE_ID = 'lightbox'

export {
    createLightboxDefinition,
    installLightboxes,
    LIGHTBOX_COMPONENT,
    LIGHTBOX_ROOT_SELECTOR,
} from './install-lightboxes.js'
export {
    collectLightboxGallery,
    escapeLightboxText,
    findLightboxTrigger,
    LIGHTBOX_TRIGGER_SELECTOR,
} from './lightbox-elements.js'
export { mountLightbox } from './lightbox.js'
