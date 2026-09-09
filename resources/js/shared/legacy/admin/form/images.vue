<template>
    <div data-images-root :class="classes.root">
        <div v-if="errors.length" data-images-alert :class="classes.alert">
            <button
                type="button"
                data-images-alert-close
                :class="classes.alertClose"
                :aria-label="labels.close"
                @click="closeAlert"
            >
                <span aria-hidden="true">&times;</span>
            </button>

            <p v-for="(error, index) in errors" :key="`${error}-${index}`">
                <i data-images-error-icon :class="classes.errorIcon" aria-hidden="true"></i>
                {{ error }}
            </p>
        </div>

        <div
            ref="gallery"
            data-images-gallery
            :class="[classes.gallery, readonly && classes.galleryReadonly]"
        >
            <article
                v-for="(uri, index) in vals"
                :key="`${uri}-${index}`"
                data-images-item
                :class="classes.item"
            >
                <button
                    type="button"
                    data-images-preview
                    :class="classes.previewButton"
                    :aria-label="previewLabel(index)"
                    @click="openLightbox(index)"
                >
                    <img :src="imageUrl(uri)" alt="" data-images-preview-image />
                    <span data-images-order :class="classes.order" aria-hidden="true">
                        {{ index + 1 }}
                    </span>
                </button>

                <div data-images-info :class="classes.info">
                    <button
                        v-if="!readonly && draggable"
                        type="button"
                        data-images-drag-handle
                        :class="classes.dragButton"
                        :aria-label="labels.reorder"
                        :title="labels.reorder"
                    >
                        <i data-images-drag-icon :class="classes.dragIcon" aria-hidden="true"></i>
                    </button>
                    <a
                        :href="imageUrl(uri)"
                        data-images-download
                        :class="classes.downloadButton"
                        download
                        :title="labels.download"
                        :aria-label="labels.download"
                        @click.prevent="downloadImage(uri)"
                    >
                        <i
                            data-images-download-icon
                            :class="classes.downloadIcon"
                            aria-hidden="true"
                        ></i>
                    </a>
                    <button
                        v-if="!readonly"
                        type="button"
                        data-images-insert
                        :class="classes.insertButton"
                        :title="labels.insertLink"
                        :aria-label="labels.insertLink"
                        @click="insert(index)"
                    >
                        <i
                            data-images-insert-icon
                            :class="classes.insertIcon"
                            aria-hidden="true"
                        ></i>
                    </button>
                    <button
                        v-if="!readonly"
                        type="button"
                        data-images-remove
                        :class="classes.removeButton"
                        :title="labels.remove"
                        :aria-label="labels.remove"
                        @click="remove(index)"
                    >
                        <i
                            data-images-remove-icon
                            :class="classes.removeIcon"
                            aria-hidden="true"
                        ></i>
                    </button>
                </div>
            </article>
        </div>

        <div v-if="!readonly" data-images-actions :class="classes.actions">
            <button
                v-if="!onlyLink"
                ref="uploadButton"
                type="button"
                data-images-upload
                :class="classes.uploadButton"
            >
                <i data-images-upload-icon :class="uploadIconClass" aria-hidden="true"></i>
                {{ labels.browse }}
            </button>
            <button
                type="button"
                data-images-insert-new
                :class="classes.insertNewButton"
                :title="labels.insertLink"
                :aria-label="labels.insertLink"
                @click="insert()"
            >
                <i data-images-insert-icon :class="classes.insertIcon" aria-hidden="true"></i>
            </button>
        </div>

        <input data-images-value :name="name" type="hidden" :value="serializedValues" />

        <Teleport to="body">
            <dialog
                v-if="hasValues"
                ref="lightbox"
                data-images-dialog
                :class="classes.dialog"
                :aria-label="labels.preview"
                @cancel="resetLightbox"
                @click.self="closeLightbox"
                @close="resetLightbox"
                @keydown="handleLightboxKey"
            >
                <button
                    type="button"
                    data-images-dialog-close
                    :class="classes.dialogCloseButton"
                    :aria-label="labels.close"
                    :title="labels.close"
                    @click="closeLightbox"
                >
                    <i
                        data-images-dialog-close-icon
                        :class="classes.dialogCloseIcon"
                        aria-hidden="true"
                    ></i>
                </button>
                <div data-images-dialog-frame :class="classes.dialogFrame">
                    <button
                        type="button"
                        data-images-dialog-previous
                        :class="classes.dialogPreviousButton"
                        :aria-label="labels.previous"
                        :title="labels.previous"
                        @click="showPreviousImage"
                    >
                        <i
                            data-images-dialog-previous-icon
                            :class="classes.dialogPreviousIcon"
                            aria-hidden="true"
                        ></i>
                    </button>
                    <img
                        :src="lightboxUrl"
                        alt=""
                        data-images-dialog-image
                        :class="classes.dialogImage"
                    />
                    <button
                        type="button"
                        data-images-dialog-next
                        :class="classes.dialogNextButton"
                        :aria-label="labels.next"
                        :title="labels.next"
                        @click="showNextImage"
                    >
                        <i
                            data-images-dialog-next-icon
                            :class="classes.dialogNextIcon"
                            aria-hidden="true"
                        ></i>
                    </button>
                </div>
                <p data-images-dialog-position :class="classes.dialogPosition" aria-live="polite">
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
import { downloadFile } from '../../../features/forms/file-download'
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
        classes: { type: Object, default: () => ({}) },
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
        uploadIconClass() {
            return this.uploading ? this.classes.uploadingIcon : this.classes.uploadIcon
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
        async downloadImage(uri) {
            try {
                await downloadFile(this.imageUrl(uri), { document: this.$el.ownerDocument })
            } catch (error) {
                if (!this.disposed) Admin.Messages.error(this.messages.responseError, error.message)
            }
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
            this.sortable = createImagesSortable(
                Sortable,
                this.$refs.gallery,
                this.classes.sortableGhost,
                this.reorder,
            )
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
