<template>
    <div class="soa-images" data-soa-images-root>
        <div v-if="errors.length" class="alert alert-warning">
            <button type="button" class="close" aria-label="Close" @click="closeAlert">
                <span aria-hidden="true">&times;</span>
            </button>

            <p v-for="(error, index) in errors" :key="`${error}-${index}`">
                <i class="fa-fw fas fa-images" aria-hidden="true"></i> {{ error }}
            </p>
        </div>

        <div
            ref="gallery"
            class="form-element-files dropzone clearfix soa-images__grid"
            :class="{ 'dropzone-disabled': readonly }"
            data-soa-images-gallery
        >
            <article
                v-for="(uri, index) in vals"
                :key="`${uri}-${index}`"
                class="form-element-files__item soa-images__item"
                data-soa-images-item
            >
                <button
                    type="button"
                    class="form-element-files__image soa-images__preview"
                    data-soa-images-preview
                    :aria-label="previewLabel(index)"
                    @click="openLightbox(index)"
                >
                    <img :src="imageUrl(uri)" alt="" />
                    <span class="soa-images__order" aria-hidden="true">{{ index + 1 }}</span>
                </button>

                <div class="form-element-files__info">
                    <button
                        v-if="!readonly && draggable"
                        type="button"
                        class="btn btn-clear btn-sm pull-right drag-cursor"
                        data-soa-images-drag-handle
                        :aria-label="labels.reorder"
                        :title="labels.reorder"
                    >
                        <i class="fa-fw fas fa-arrows-alt" aria-hidden="true"></i>
                    </button>
                    <a
                        :href="imageUrl(uri)"
                        class="btn btn-default btn-sm pull-right"
                        data-soa-images-download
                        download
                        rel="noopener"
                        target="_blank"
                        :title="labels.download"
                    >
                        <i class="fa-fw fas fa-cloud-upload-alt" aria-hidden="true"></i>
                    </a>
                    <button
                        v-if="!readonly"
                        type="button"
                        class="btn btn-default btn-sm pull-right mr-1"
                        data-soa-images-insert
                        :title="labels.insertLink"
                        @click="insert(index)"
                    >
                        <i class="fa-fw fas fa-link" aria-hidden="true"></i>
                    </button>
                    <button
                        v-if="!readonly"
                        type="button"
                        class="btn btn-danger btn-xs gallery-remove"
                        data-soa-images-remove
                        :title="labels.remove"
                        @click="remove(index)"
                    >
                        <i class="fa-fw fas fa-times" aria-hidden="true"></i>
                    </button>
                </div>
            </article>
        </div>

        <div v-if="!readonly" class="form-element-button-add w-100 order-2 mt-2">
            <button
                v-if="!onlyLink"
                ref="uploadButton"
                type="button"
                class="btn btn-primary upload-button btn-sm"
                data-soa-images-upload
            >
                <i :class="uploadClass" aria-hidden="true"></i> {{ labels.browse }}
            </button>
            <button
                type="button"
                class="btn btn-default btn-sm"
                data-soa-images-insert-new
                :title="labels.insertLink"
                @click="insert()"
            >
                <i class="fa-fw fas fa-link" aria-hidden="true"></i>
            </button>
        </div>

        <input data-soa-images-value :name="name" type="hidden" :value="serializedValues" />

        <Teleport to="body">
            <dialog
                v-if="hasValues"
                ref="lightbox"
                class="soa-images-dialog"
                data-soa-images-dialog
                :aria-label="labels.preview"
                @cancel="resetLightbox"
                @click.self="closeLightbox"
                @close="resetLightbox"
                @keydown="handleLightboxKey"
            >
                <button
                    type="button"
                    class="btn btn-default soa-images-dialog__close"
                    data-soa-images-dialog-close
                    :aria-label="labels.close"
                    :title="labels.close"
                    @click="closeLightbox"
                >
                    <i class="fas fa-times" aria-hidden="true"></i>
                </button>
                <div class="soa-images-dialog__frame">
                    <button
                        type="button"
                        class="btn btn-default soa-images-dialog__previous"
                        data-soa-images-dialog-previous
                        :aria-label="labels.previous"
                        :title="labels.previous"
                        @click="showPreviousImage"
                    >
                        <i class="fas fa-chevron-left" aria-hidden="true"></i>
                    </button>
                    <img :src="lightboxUrl" alt="" class="soa-images-dialog__image" />
                    <button
                        type="button"
                        class="btn btn-default soa-images-dialog__next"
                        data-soa-images-dialog-next
                        :aria-label="labels.next"
                        :title="labels.next"
                        @click="showNextImage"
                    >
                        <i class="fas fa-chevron-right" aria-hidden="true"></i>
                    </button>
                </div>
                <p class="soa-images-dialog__position" aria-live="polite">
                    {{ lightboxPosition }}
                </p>
            </dialog>
        </Teleport>
    </div>
</template>

<script>
import Sortable from 'sortablejs'
import { defineComponent, nextTick } from 'vue'

import Dropzone from '../../libs/dropzone'
import {
    createImagePasteBody,
    readImagePasteBuffer,
    removeImagePasteBuffer,
} from './image-paste-buffer'
import { imageUploadError, postPastedImage } from './image-upload'
import { imagePreviewUrl, isBlobImageValue } from './image-value'
import { createImagesSortable } from './images-sortable'
import { createImagesUpload } from './images-upload'
import {
    addImageValue,
    normalizeImagesValues,
    removeImageValue,
    reorderImageValues,
    replaceImageValue,
    serializeImagesValues,
} from './images-values'
import { responseErrors } from './upload-response'

export default defineComponent({
    name: 'ElementImages',
    props: {
        assetPrefix: { type: String, default: '' },
        csrfToken: { type: String, required: true },
        draggable: { type: Boolean, default: true },
        labels: { type: Object, required: true },
        maxFileSize: { type: Number, required: true },
        messages: { type: Object, required: true },
        name: { type: String, required: true },
        onlyLink: Boolean,
        readonly: Boolean,
        url: { type: String, required: true },
        values: { type: Array, default: () => [] },
    },
    data() {
        return {
            disposed: false,
            errors: [],
            lightboxIndex: null,
            pasteActive: false,
            sortable: null,
            uploader: null,
            uploading: false,
            vals: normalizeImagesValues(this.values),
        }
    },
    computed: {
        hasValues() {
            return this.vals.length > 0
        },
        lightboxPosition() {
            return this.lightboxIndex === null
                ? ''
                : `${this.lightboxIndex + 1} / ${this.vals.length}`
        },
        lightboxUrl() {
            return this.lightboxIndex === null ? '' : this.imageUrl(this.vals[this.lightboxIndex])
        },
        serializedValues() {
            return serializeImagesValues(this.vals)
        },
        uploadClass() {
            return this.uploading ? 'fas fa-spinner fa-spin' : 'fas fa-images'
        },
    },
    mounted() {
        if (!this.readonly && !this.onlyLink) this.mountUpload()
        if (!this.readonly && this.draggable) this.mountSortable()
    },
    beforeUnmount() {
        this.disposed = true
        this.closeLightbox()
        this.sortable?.destroy()
        this.uploader?.destroy()
        this.sortable = null
        this.uploader = null
        if (this.pasteActive) removeImagePasteBuffer(this.pasteDocument())
    },
    methods: {
        applyInsertedValue(value, index) {
            if (!value) return removeImagePasteBuffer(this.pasteDocument())
            if (isBlobImageValue(value)) {
                if (this.onlyLink) return removeImagePasteBuffer(this.pasteDocument())

                return this.uploadPastedImage(index)
            }

            removeImagePasteBuffer(this.pasteDocument())
            this.setValue(value, index)

            return true
        },
        closeAlert() {
            this.errors = []
        },
        closeLightbox() {
            const dialog = this.$refs.lightbox
            if (dialog?.open && typeof dialog.close === 'function') dialog.close()
            else dialog?.removeAttribute('open')
            this.lightboxIndex = null
        },
        completeUpload(response) {
            this.setValue(response?.value)
        },
        failUpload(response) {
            const errors = responseErrors(response)
            if (errors[0]) Admin.Messages.error(response?.message, errors[0])
            this.errors = errors
        },
        finishUpload() {
            this.uploading = false
        },
        handleLightboxKey(event) {
            if (event.key === 'ArrowLeft') this.showPreviousImage()
            if (event.key === 'ArrowRight') this.showNextImage()
            if (event.key.startsWith('Arrow')) event.preventDefault()
        },
        imageUrl(uri) {
            return imagePreviewUrl(uri, {
                assetPrefix: this.assetPrefix,
                createUploadUrl: (path) => Admin.Url.upload(path),
                useAssetPrefix: true,
            })
        },
        async insert(index = null) {
            const current = index === null ? null : this.vals[index]
            this.pasteActive = true
            try {
                const result = await Admin.Messages.cliptobuffer(
                    this.labels.insertLink,
                    null,
                    null,
                    current,
                    current === null ? null : this.imageUrl(current),
                )
                if (!this.disposed) await this.applyInsertedValue(result?.value, index)
            } finally {
                this.pasteActive = false
            }
        },
        mountSortable() {
            this.sortable = createImagesSortable(Sortable, this.$refs.gallery, this.reorder)
        },
        mountUpload() {
            this.uploader = createImagesUpload(Dropzone, this.$refs.gallery, {
                clickable: this.$refs.uploadButton,
                csrfToken: this.csrfToken,
                fileTooBigText: this.messages.fileTooBig,
                invalidFileTypeText: this.messages.invalidFileType,
                maxFileSize: this.maxFileSize,
                onComplete: this.finishUpload,
                onError: this.failUpload,
                onSending: this.startUpload,
                onSuccess: this.completeUpload,
                responseErrorText: this.messages.responseError,
                url: this.url,
            })
        },
        async openLightbox(index) {
            this.lightboxIndex = index
            await nextTick()
            const dialog = this.$refs.lightbox
            if (!dialog || this.disposed) return
            if (typeof dialog.showModal === 'function') dialog.showModal()
            else dialog.setAttribute('open', '')
        },
        pasteDocument() {
            return this.$el.ownerDocument
        },
        previewLabel(index) {
            return `${this.labels.preview} ${index + 1}`
        },
        async remove(index) {
            const result = await Admin.Messages.confirm(this.messages.confirmRemove)
            if (this.disposed || !result.value) return

            this.closeLightbox()
            this.vals = removeImageValue(this.vals, index)
        },
        reorder(from, to) {
            this.vals = reorderImageValues(this.vals, from, to)
        },
        resetLightbox() {
            this.lightboxIndex = null
        },
        setValue(value, index = null) {
            this.vals =
                index === null
                    ? addImageValue(this.vals, value)
                    : replaceImageValue(this.vals, index, value)
        },
        showNextImage() {
            if (this.lightboxIndex === null) return
            this.lightboxIndex = (this.lightboxIndex + 1) % this.vals.length
        },
        showPreviousImage() {
            if (this.lightboxIndex === null) return
            this.lightboxIndex = (this.lightboxIndex - 1 + this.vals.length) % this.vals.length
        },
        startUpload() {
            this.uploading = true
            this.closeAlert()
        },
        async uploadPastedImage(index) {
            const document = this.pasteDocument()
            const buffer = readImagePasteBuffer(document)
            if (!buffer) return false

            this.startUpload()
            try {
                const response = await postPastedImage(
                    Admin.Http,
                    this.url,
                    createImagePasteBody(buffer),
                )
                if (!this.disposed) this.setValue(response?.path ?? response?.value, index)
            } catch (error) {
                await this.showPasteUploadError(error)
            } finally {
                removeImagePasteBuffer(document)
                if (!this.disposed) this.finishUpload()
            }

            return true
        },
        async showPasteUploadError(error) {
            const details = await imageUploadError(error, this.messages.responseError)
            if (!this.disposed) Admin.Messages.error(details.title, details.message)
        },
    },
})
</script>
