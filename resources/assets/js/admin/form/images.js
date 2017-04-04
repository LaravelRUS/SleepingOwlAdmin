Vue.component('element-images', Vue.extend({
    props: {
        url: {
            required: true
        },
        values: {
            type: Array,
            default: () => new Array
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
            values: [],
            uploading: false,
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

            container.magnificPopup({
                delegate: '[data-toggle="images"]',
                type: 'image',
                gallery:{
                    enabled:true
                }
            });

            container.find('.dropzone').dropzone({
                url: this.url,
                method: 'POST',
                previewsContainer: false,
                acceptedFiles: 'image/*',
                clickable: button[0],
                dictDefaultMessage: '',
                sending () {
                    self.uploading = true;
                    self.closeAlert();
                },
                success (file, response) {
                    self.values.push(response.value);
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
        image (uri) {
            return ((uri.indexOf('http') === 0) ? uri : Admin.Url.upload(uri));
        },
        remove (image) {
            var self = this;

            Admin.Messages.confirm(trans('lang.message.are_you_sure')).then(() => {
                self.$set('values', _.filter(self.values, function (img) {
                    return image != img
                }));
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
        has_values () {
            return this.values.length > 0
        },
        serializedValues () {
            return this.values.join(',')
        }
    }
}));
