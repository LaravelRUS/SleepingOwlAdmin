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
            uploading: false
        }
    },
    ready () {
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
                previewsContainer: false,
                acceptedFiles: 'image/*',
                dictDefaultMessage: '',
                sending () {
                    self.uploading = true;
                    self.closeAlert()
                },
                success (file, response) {
                    self.value = response.value;
                },
                error (file, response) {
                    if(_.isArray(response.errors)) {
                        self.$set('errors', response.errors);
                    }
                },
                complete(){
                    self.uploading = false;
                }
            });
        },
        remove () {
            var self = this;

            Admin.Messages.confirm(trans('lang.message.are_you_sure')).then(() => {
                self.value = '';
            });
        },
        closeAlert () {
            this.$set('errors', []);
        }
    },
    computed: {
        uploadClass() {
            if (!this.uploading) {
                return 'fa fa-upload';
            }
            return 'fa fa-spinner fa-spin'
        },
        has_value () {
            return this.value.length > 0
        },
        image () {
            return ((this.value.indexOf('http') === 0) ? this.value : Admin.Url.upload(this.value))
        }
    }
}));
