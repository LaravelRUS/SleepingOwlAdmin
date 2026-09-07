<template>
    <div>
        <div v-if="errors.length" data-file-alert :class="classes.alert">
            <button
                type="button"
                data-file-alert-close
                :class="classes.alertClose"
                aria-label="Close"
                @click="closeAlert"
            >
                <span aria-hidden="true">&times;</span>
            </button>

            <p v-for="error in errors" :key="error">
                <i data-file-error-icon :class="classes.errorIcon" aria-hidden="true"></i>
                {{ error }}
            </p>
        </div>

        <div v-if="hasValue" data-file-current :class="classes.current">
            <div data-file-item :class="classes.item">
                <div :class="classes.file">
                    <i :class="classes.fileIcon" aria-hidden="true"></i>
                </div>
                <div :class="classes.info">
                    <a
                        :href="downloadUrl"
                        data-file-download
                        :class="classes.downloadButton"
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
                        data-file-remove
                        :class="classes.removeButton"
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
            <button ref="uploadButton" type="button" data-file-upload :class="classes.uploadButton">
                <i data-file-upload-icon :class="uploadIconClass" aria-hidden="true"></i>
                {{ labels.browse }}
            </button>
        </div>

        <input data-file-value :name="name" type="hidden" :value="val" />
    </div>
</template>

<script>
import { defineComponent } from 'vue'

import Dropzone from '../../libs/dropzone'
import { downloadFile } from '../../../../frontend/features/forms/file-download'
import { createFileUpload } from './file-upload'
import { fileDownloadUrl, normalizeFileValue } from './file-value'
import { responseErrors } from './upload-response'

export default defineComponent({
    name: 'ElementFile',
    props: {
        classes: { type: Object, default: () => ({}) },
        csrfToken: { type: String, required: true },
        labels: { type: Object, required: true },
        maxFileSize: { type: Number, required: true },
        messages: { type: Object, required: true },
        name: { type: String, required: true },
        readonly: Boolean,
        url: { type: String, required: true },
        value: { type: [String, Number], default: '' },
    },
    data() {
        return {
            errors: [],
            uploader: null,
            uploading: false,
            val: normalizeFileValue(this.value),
        }
    },
    computed: {
        downloadUrl() {
            return fileDownloadUrl(this.val, (path) => Admin.Url.upload(path))
        },
        hasValue() {
            return this.val.length > 0
        },
        uploadIconClass() {
            return this.uploading ? this.classes.uploadingIcon : this.classes.uploadIcon
        },
    },
    mounted() {
        if (!this.readonly) this.mountUpload()
    },
    beforeUnmount() {
        this.uploader?.destroy()
        this.uploader = null
    },
    methods: {
        closeAlert() {
            this.errors = []
        },
        completeUpload(response) {
            this.val = normalizeFileValue(response?.value)
        },
        async downloadCurrent() {
            try {
                await downloadFile(this.downloadUrl, { document: this.$el.ownerDocument })
            } catch (error) {
                Admin.Messages.error(this.messages.responseError, error.message)
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
        mountUpload() {
            this.uploader = createFileUpload(Dropzone, this.$refs.uploadButton, {
                csrfToken: this.csrfToken,
                fileTooBigText: this.messages.fileTooBig,
                maxFileSize: this.maxFileSize,
                onComplete: this.finishUpload,
                onError: this.failUpload,
                onSending: this.startUpload,
                onSuccess: this.completeUpload,
                responseErrorText: this.messages.responseError,
                url: this.url,
            })
        },
        async remove() {
            const result = await Admin.Messages.confirm(this.messages.confirmRemove)
            if (result.value) this.val = ''
        },
        startUpload() {
            this.uploading = true
            this.closeAlert()
        },
    },
})
</script>
