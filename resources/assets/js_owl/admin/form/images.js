import draggable from 'vuedraggable'

Vue.component('element-images', Vue.extend({
    props: {
        url: {
            required: true
        },
        values: {
            type: Array,
            default: () => []
        },
        readonly: {
            type: Boolean,
            default: false
        },
        draggable: {
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
            vals: [],
            uploading: false,
        }
    },
    mounted () {
        this.vals = this.values;
        if (!this.readonly) {
            this.initUpload();
        }

    },
    components: {
        draggable
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
                maxFilesize: Admin.Config.get('max_file_size'),
                dictFileTooBig: trans('lang.ckeditor.upload.error.filesize_limit_m', {size: Admin.Config.get('max_file_size')}),
                dictInvalidFileType: trans('lang.ckeditor.upload.error.wrong_extension', {file: self.name}),
                dictResponseError: trans('lang.ckeditor.upload.error.common'),
                sending () {
                    self.uploading = true;
                    self.closeAlert();
                },
                success (file, response) {
                    self.vals.push(response.value);
                },
                error (file, response) {
                    if(_.isArray(response.errors)) {
                        if (response.errors[0]) {
                            Admin.Messages.error(response.message, response.errors[0])
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

        insert (index) {
            let self = this;
            let url = null;
            let link = null;
            if (typeof(index) !== 'undefined') {
              url = self.vals[index];
              link = this.image(url);
            }

            Admin.Messages.prompt(trans('lang.file.insert_link'), null, null, url, link).then(result => {
                if(result.value){
                    if (typeof(index) !== 'undefined') {
                      self.$set(this.vals, [index], result.value)
                    } else {
                      self.vals.push(result.value);
                    }
                } else {
                    return false;
                }
            });
        },

        remove (image) {
            let self = this;

            Admin.Messages.confirm(trans('lang.message.are_you_sure')).then(result => {
                if(result.value){
                    self.vals = _.filter(self.vals, function (img, key) {
                        return image !== key
                    });
                }else{
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
                return 'fas fa-images';
            }
            return 'fas fa-spinner fa-spin'
        },
        has_values () {
            return this.vals.length > 0
        },
        serializedValues () {
            return this.vals.join(',')
        }
    }
}));
