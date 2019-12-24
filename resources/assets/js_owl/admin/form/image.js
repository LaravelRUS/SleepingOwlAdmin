Vue.component('element-image', Vue.extend({
    props: {
        url: {
            required: true
        },
        value: {
            default: ''
        },
        readonly: {
            type: Boolean,
            default: false
        },
        name: {
            type: String,
            required: true
        }
    },
    data () {
        return {
            errors: [],
            uploading: false,
            val: '',
        }
    },
    mounted () {
        this.val = this.value;
        this.initUpload()
    },
    methods: {
        initUpload () {
            let self = this,
                container = $(self.$el.parentNode),
                button = container.find('.upload-button');
            button.dropzone({
                url: this.url,
                method: 'POST',
                uploadMultiple: false,
                maxFilesize: Admin.Config.get('max_file_size'),
                dictFileTooBig: trans('lang.ckeditor.upload.error.filesize_limit_m', {size: Admin.Config.get('max_file_size')}),
                dictInvalidFileType: trans('lang.ckeditor.upload.error.wrong_extension', {file: self.name}),
                dictResponseError: trans('lang.ckeditor.upload.error.common'),
                previewsContainer: false,
                acceptedFiles: 'image/*',
                dictDefaultMessage: '',
                sending () {
                    self.uploading = true;
                    self.closeAlert()
                },
                success (file, response) {
                    self.val = response.value;
                },
                error (file, response) {
                    if(_.isArray(response.errors)) {
                        if (response.errors[0]) {
                            Admin.Messages.error(response.errors[0])
                        }
                        self.errors = response.errors;
                    }
                },
                complete(){
                    self.uploading = false;
                }
            });
        },
        image (uri) {
            return ((uri.indexOf('http') === 0) ? uri : Admin.Url.upload(uri));
        },
        remove () {
            let self = this;
            Admin.Messages.confirm(trans('lang.message.are_you_sure')).then((result) => {
                if(result.value)
                    self.val = '';
                else
                    return false;
            });
        },
        insert (image) {
            let self = this;
            let url = null;
            let link = null;
            if (typeof(image) !== 'undefined') {
              url = self.val;
              link = this.image(url);
            }

            Admin.Messages.prompt(trans('lang.file.insert_link'), null, null, url, link).then(result => {
                if(result.value) {
                    self.val = result.value;
                } else {
                    return false;
                }
            });
        },
        closeAlert () {
            this.errors = [];
        }
    },
    computed: {
        uploadClass() {
            if (!this.uploading) {
                return 'fas fa-image';
            }
            return 'fas fa-spinner fa-spin'
        },
        has_value () {
            return this.val.length > 0
        },
        createdimage () {
            return ((this.val.indexOf('http') === 0) ? this.val : Admin.Url.upload(this.val))
        },
    }
}));
