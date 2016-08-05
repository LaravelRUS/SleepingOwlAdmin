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
            values: []
        }
    },
    ready () {
        this.initUpload()
        console.log(this.values);
    },
    methods: {
        initUpload () {
            var self = this,
                flow = new Flow({
                    target: this.url,
                    testChunks: false,
                    singleFile: false,
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
                self.values.push(result.url);
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
        remove (image) {
            this.$set('values', _.filter(this.values, function (img) {
                return image != img
            }));
        }
    },
    computed: {
        has_values () {
            return this.values.length > 0
        },
        serializedValues () {
            return this.values.join(',')
        }
    }
}));