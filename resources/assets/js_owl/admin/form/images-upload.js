import { imageUploadOptions } from './image-upload'

export function createImagesUpload(Upload, container, config) {
    return new Upload(container, imagesUploadOptions(config))
}

export function imagesUploadOptions(config) {
    return {
        ...imageUploadOptions(config),
        clickable: config.clickable,
    }
}
