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
        this.initUpload();
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
                    self.vals.push(response.value);
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
        image (uri) {
            console.log(uri);
            return ((uri.indexOf('http') === 0) ? uri : Admin.Url.upload(uri));
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
                return 'fa fa-upload';
            }
            return 'fa fa-spinner fa-spin'
        },
        has_values () {
            return this.vals.length > 0
        },
        serializedValues () {
            return this.vals.join(',')
        }
    }
}));
