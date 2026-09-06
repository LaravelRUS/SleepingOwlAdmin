<template>
    <div>
        <div v-if="errors.length" class="alert alert-warning">
            <button type="button" class="close" aria-label="Close" @click="closeAlert">
                <span aria-hidden="true">&times;</span>
            </button>

            <p v-for="error in errors" :key="error">
                <i class="fas fa-file-alt" aria-hidden="true"></i> {{ error }}
            </p>
        </div>

        <div v-if="hasValue" class="form-element-files clearfix">
            <div class="form-element-files__item">
                <div class="form-element-files__file">
                    <i class="fa-fw fas fa-file-alt"></i>
                </div>
                <div class="form-element-files__info">
                    <a
                        :href="downloadUrl"
                        class="btn btn-default btn-xs pull-right"
                        data-soa-file-download
                        download
                        :title="labels.download"
                        target="_blank"
                    >
                        <i class="fas fa-cloud-upload-alt"></i>
                    </a>

                    <button
                        v-if="!readonly"
                        type="button"
                        class="btn btn-danger btn-xs"
                        data-soa-file-remove
                        @click="remove"
                    >
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        </div>

        <div v-if="!readonly">
            <button ref="uploadButton" type="button" class="btn btn-primary upload-button btn-sm">
                <i :class="uploadClass"></i> {{ labels.browse }}
            </button>
        </div>

        <input data-soa-file-value :name="name" type="hidden" :value="val" />
    </div>
</template>

<script>
import { defineComponent } from 'vue'

import Dropzone from '../../libs/dropzone'
import { createFileUpload } from './file-upload'
import { fileDownloadUrl, normalizeFileValue } from './file-value'
import { responseErrors } from './upload-response'

export default defineComponent({
    name: 'ElementFile',
    props: {
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
        uploadClass() {
            return this.uploading ? 'fas fa-spinner fa-spin' : 'fas fa-file-upload'
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
