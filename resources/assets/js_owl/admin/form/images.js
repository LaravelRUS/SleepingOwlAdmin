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
        onlylink: {
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

            if (self.onlylink) {
                return false
            }

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
            return ((uri.indexOf('http') === 0 || uri.indexOf('blob:') === 0) ? uri : Admin.Url.upload(uri));
        },

        insert (index) {
            let self = this;
            let url = null;
            let link = null;

            if (typeof(index) !== 'undefined') {
              url = self.vals[index];
              link = this.image(url);
            }

            Admin.Messages.cliptobuffer(trans('lang.file.insert_link'), null, null, url, link).then(result => {
              if(result && result.value) {
                var input = document.getElementById('image-paste-in-buffer')

                if (typeof(index) !== 'undefined') {
                  self.$set(this.vals, [index], result.value)
                } else {
                  if (self.onlylink && result.value.indexOf('blob:') === 0) {
                    if (input) {
                      input.remove()
                    }
                    return false
                  }
                  if (result.value.indexOf('blob:') === 0) {
                    this.uploadImage()
                  } else {
                    if (input) {
                      input.remove()
                    }
                    self.vals.push(result.value);
                  }
                }
              } else {
                return false;
              }
            });
        },

        uploadImage() {
          let self = this
          var input = document.getElementById('image-paste-in-buffer')

          const dataURLtoFile = (dataurl, filename) => {
            const arr = dataurl.split(',')
            const mime = arr[0].match(/:(.*?);/)[1]
            const bstr = atob(arr[1])
            let n = bstr.length
            const u8arr = new Uint8Array(n)
            while (n) {
              u8arr[n - 1] = bstr.charCodeAt(n - 1)
              n -= 1 // to make eslint happy
            }
            return new File([u8arr], Date.now(), { type: mime })
          }

          const url = input.src
          const ext = input.dataset.ext ? input.dataset.ext : 'jpg'
          const file = dataURLtoFile(url)

          const formData = new FormData()
          formData.append('file', file, Date.now() + '.' + ext)

          let config = {
            header : {
              'Content-Type' : 'multipart/form-data',
              'X-Requested-With': 'XMLHttpRequest'
            }
          }

          axios.post(this.url, formData, config).then(response => {
            if (response.data.path) {
              self.vals.push(response.data.path)
            }
          })
          .catch(error => {
            if (error.response.data.errors) {
              Admin.Messages.error(error.response.data.message, error.response.data.errors[0])
            } else {
              Admin.Messages.error(error.response.statusText + ' (' + error.response.status + ')', error.response.data.message)
            }
          })

          input = document.getElementById('image-paste-in-buffer')
          if (input) {
            if (input.name) {
              window.URL.revokeObjectURL(input.name)
            }
            input.remove()
          }

          return true
        },

        remove (image) {
            let self = this;

            Admin.Messages.confirm(trans('lang.message.are_you_sure')).then(result => {
                if(result.value){
                    self.vals = _.filter(self.vals, function (img, key) {
                        return image !== key
                    });
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
