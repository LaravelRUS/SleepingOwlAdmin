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
            errors: []
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
                dictDefaultMessage: '',
                headers: {
                    'X-CSRF-TOKEN': window.Admin.Settings.token
                },
                sending () {
                    self.closeAlert()
                },
                success (file, response) {
                    self.value = response.value;
                },
                error (file, response) {
                    if(_.isArray(response.errors)) {
                        self.$set('errors', response.errors);
                    }
                }
            });
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
            }, dismiss => {

            });
        },
        closeAlert () {
            this.$set('errors', []);
        }
    },
    computed: {
        has_value () {
            return this.value.length > 0
        },
        file () {
            return ((this.value.indexOf('http') === 0) ? this.value : Admin.Settings.base_url + this.value)
        }
    }
}));
