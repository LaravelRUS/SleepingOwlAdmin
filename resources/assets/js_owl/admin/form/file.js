Vue.component('element-file', Vue.extend({
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
                previewsContainer: false,

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
                        self.errors = response.errors;
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
                self.val = '';
            });
        },
        closeAlert () {
            this.errors = [];
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
            return this.val.length > 0
        },
        file () {
            return ((this.val.indexOf('http') === 0) ? this.val : Admin.Url.upload(this.val))
        }
    }
}));
