<template>
    <div>
        <div v-if="errors.length" data-image-alert :class="classes.alert">
            <button
                type="button"
                data-image-alert-close
                :class="classes.alertClose"
                aria-label="Close"
                @click="closeAlert"
            >
                <span aria-hidden="true">&times;</span>
            </button>

            <p v-for="(error, index) in errors" :key="`${error}-${index}`">
                <i data-image-error-icon :class="classes.errorIcon" aria-hidden="true"></i>
                {{ error }}
            </p>
        </div>

        <div v-if="hasValue" data-image-current :class="classes.current">
            <div data-image-item :class="classes.item">
                <a
                    :href="previewUrl"
                    data-image-preview-link
                    data-lightbox
                    :class="classes.previewLink"
                >
                    <img :src="previewUrl" alt="" data-image-preview />
                </a>
                <div data-image-info :class="classes.info">
                    <a
                        :href="previewUrl"
                        data-image-download
                        :class="classes.downloadButton"
                        data-toggle="tooltip"
                        data-bs-toggle="tooltip"
                        download
                        :title="labels.download"
                        :aria-label="labels.download"
                        @click.prevent="downloadCurrent"
                    >
                        <i :class="classes.downloadIcon" aria-hidden="true"></i>
                    </a>
                    <button
                        v-if="!readonly"
                        type="button"
                        data-image-insert-current
                        :class="classes.insertCurrentButton"
                        data-toggle="tooltip"
                        data-bs-toggle="tooltip"
                        :title="labels.insertLink"
                        :aria-label="labels.insertLink"
                        @click="insert(true)"
                    >
                        <i :class="classes.insertIcon" aria-hidden="true"></i>
                    </button>
                    <button
                        v-if="!readonly"
                        type="button"
                        data-image-remove
                        :class="classes.removeButton"
                        data-toggle="tooltip"
                        data-bs-toggle="tooltip"
                        :title="labels.remove"
                        :aria-label="labels.remove"
                        @click="remove"
                    >
                        <i :class="classes.removeIcon" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        </div>

        <div v-if="!readonly">
            <button
                v-if="!onlyLink"
                ref="uploadButton"
                type="button"
                data-image-upload
                :class="classes.uploadButton"
            >
                <i data-image-upload-icon :class="uploadIconClass" aria-hidden="true"></i>
                {{ labels.browse }}
            </button>
            <button
                type="button"
                data-image-insert-new
                :class="classes.insertNewButton"
                data-toggle="tooltip"
                data-bs-toggle="tooltip"
                :title="labels.insertLink"
                :aria-label="labels.insertLink"
                @click="insert(false)"
            >
                <i :class="classes.insertIcon" aria-hidden="true"></i>
            </button>
        </div>

        <input data-image-value :name="name" type="hidden" :value="val" />
    </div>
</template>

<script>
import { defineComponent } from 'vue'

import Dropzone from '../../libs/dropzone'
import { downloadFile } from '../../../features/forms/file-download'
import {
    createImagePasteBody,
    readImagePasteBuffer,
    removeImagePasteBuffer,
} from './image-paste-buffer'
import { createImageUpload, imageUploadError, postPastedImage } from './image-upload'
import { imagePreviewUrl, isBlobImageValue, normalizeImageValue } from './image-value'
import { responseErrors } from './upload-response'

export default defineComponent({
    name: 'ElementImage',
    props: {
        assetPrefix: { type: String, default: '' },
        classes: { type: Object, default: () => ({}) },
        csrfToken: { type: String, required: true },
        labels: { type: Object, required: true },
        maxFileSize: { type: Number, required: true },
        messages: { type: Object, required: true },
        name: { type: String, required: true },
        onlyLink: Boolean,
        readonly: Boolean,
        url: { type: String, required: true },
        value: { type: [String, Number], default: '' },
    },
    data() {
        return {
            disposed: false,
            errors: [],
            pasteActive: false,
            uploader: null,
            uploading: false,
            useAssetPrefix: true,
            val: normalizeImageValue(this.value),
        }
    },
    computed: {
        hasValue() {
            return this.val.length > 0
        },
        previewUrl() {
            return imagePreviewUrl(this.val, {
                assetPrefix: this.assetPrefix,
                createUploadUrl: (path) => Admin.Url.upload(path),
                useAssetPrefix: this.useAssetPrefix,
            })
        },
        uploadIconClass() {
            return this.uploading ? this.classes.uploadingIcon : this.classes.uploadIcon
        },
    },
    mounted() {
        if (!this.readonly && !this.onlyLink) this.mountUpload()
    },
    beforeUnmount() {
        this.disposed = true
        this.uploader?.destroy()
        this.uploader = null
        if (this.pasteActive) removeImagePasteBuffer(this.pasteDocument())
    },
    methods: {
        acceptPastedUpload(response) {
            const value = response?.path ?? response?.value
            if (value === undefined) return

            this.val = normalizeImageValue(value)
            this.useAssetPrefix = false
        },
        applyInsertedValue(value) {
            if (!value) return removeImagePasteBuffer(this.pasteDocument())
            if (isBlobImageValue(value)) {
                if (this.onlyLink) return removeImagePasteBuffer(this.pasteDocument())

                return this.uploadPastedImage()
            }

            removeImagePasteBuffer(this.pasteDocument())
            this.val = normalizeImageValue(value)

            return true
        },
        closeAlert() {
            this.errors = []
        },
        completeUpload(response) {
            if (response?.value === undefined) return

            this.val = normalizeImageValue(response.value)
            this.useAssetPrefix = false
        },
        async downloadCurrent() {
            try {
                await downloadFile(this.previewUrl, { document: this.$el.ownerDocument })
            } catch (error) {
                if (!this.disposed) Admin.Messages.error(this.messages.responseError, error.message)
            }
        },
        failUpload(response) {
            const errors = responseErrors(response)
            if (errors[0]) Admin.Messages.error(response?.message, errors[0])
            this.errors = errors
        },
        finishUpload() {
            this.uploading = false
        },
        async insert(showCurrent) {
            this.pasteActive = true
            try {
                const result = await Admin.Messages.cliptobuffer(
                    this.labels.insertLink,
                    null,
                    null,
                    showCurrent ? this.val : null,
                    showCurrent ? this.previewUrl : null,
                )
                if (!this.disposed) await this.applyInsertedValue(result?.value)
            } finally {
                this.pasteActive = false
            }
        },
        mountUpload() {
            this.uploader = createImageUpload(Dropzone, this.$refs.uploadButton, {
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
        pasteDocument() {
            return this.$el.ownerDocument
        },
        async remove() {
            const result = await Admin.Messages.confirm(this.messages.confirmRemove)
            if (!this.disposed && result.value) this.val = ''
        },
        startUpload() {
            this.uploading = true
            this.closeAlert()
        },
        async uploadPastedImage() {
            const document = this.pasteDocument()
            const buffer = readImagePasteBuffer(document)
            if (!buffer) return false

            this.startUpload()
            try {
                const body = createImagePasteBody(buffer)
                const response = await postPastedImage(Admin.Http, this.url, body)
                if (!this.disposed) this.acceptPastedUpload(response)
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
