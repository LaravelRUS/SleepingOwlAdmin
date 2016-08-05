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
            errors: []
        }
    },
    ready () {
        this.initUpload()
    },
    methods: {
        initUpload () {
            var self = this,
                flow = new Flow({
                    target: this.url,
                    testChunks: false,
                    chunkSize: 1024 * 1024 * 1024,
                    query: {
                        _token: Admin.Settings.token
                    }
                });

            let button = $(self.$el.parentNode).find('.upload-button');

            flow.assignBrowse(button, false, true)

            flow.on('filesSubmitted', (file) => {
                self.$set('errors', []);
                flow.upload();
            });

            flow.on('fileSuccess', (file, message) => {
                flow.removeFile(file);

                var result = $.parseJSON(message);
                self.value = result.url;
            });

            flow.on('fileError', (file, message) => {
                flow.removeFile(file);

                var response = $.parseJSON(message);

                if(_.isArray(response.errors)) {
                    self.$set('errors', response.errors);
                }
            });

            self.flow = flow;
        },
        remove () {
            var self = this;

            swal({
                title: i18next.t('lang.message.are_you_sure'),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: i18next.t('lang.button.yes')
            }).then(() => {
                self.value = '';
            });
        }
    },
    computed: {
        has_value () {
            return this.value.length > 0
        }
    }
}));