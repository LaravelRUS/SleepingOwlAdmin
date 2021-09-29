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
        onlylink: {
            type: Boolean,
            default: false
        },
        name: {
            type: String,
            required: true
        },
        asset_prefix: {
            type: String
        }
    },
    data () {
        return {
            errors: [],
            uploading: false,
            uploadingImage: false,
            val: '',
            prefix: '',
        }
    },
    mounted () {
        this.val = this.value
        this.initUpload()
        this.prefix = this.asset_prefix
    },
    methods: {
        initUpload () {
            let self = this,
                container = $(self.$el.parentNode),
                button = container.find('.upload-button');

            if (self.onlylink) {
                return false
            }

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
                    self.uploading = true
                    self.closeAlert()
                    self.uploadingImage = false
                },
                success (file, response) {
                    self.val = response.value
                },
                error (file, response) {
                    if(_.isArray(response.errors)) {
                        if (response.errors[0]) {
                            Admin.Messages.error(response.message, response.errors[0])
                        }
                        self.errors = response.errors
                    }
                },
                complete(){
                    self.uploading = false
                    self.uploadingImage = true
                }
            });
        },
        image (uri) {
            return ((uri.indexOf('http') === 0 || uri.indexOf('blob:') === 0) ? uri : Admin.Url.upload(uri))
        },
        remove () {
            let self = this
            Admin.Messages.confirm(trans('lang.message.are_you_sure')).then((result) => {
                if(result.value)
                    self.val = ''
                else
                    return false
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
              self.val = response.data.path
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

        insert (image) {
            let self = this
            let url = null
            let link = null
            if (typeof(image) !== 'undefined') {
              url = self.val
              link = this.image(url)
            }

            Admin.Messages.cliptobuffer(trans('lang.file.insert_link'), null, null, url, link).then(result => {
              if(result && result.value) {
                var input = document.getElementById('image-paste-in-buffer')
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
                  self.val = result.value
                }
              } else {
                return false;
              }
            });
        },
        closeAlert () {
            this.errors = []
        }
    },
    computed: {
        uploadClass() {
            if (!this.uploading) {
                return 'fas fa-image'
            }
            return 'fas fa-spinner fa-spin'
        },
        has_value () {
            return this.val.length > 0
        },
        createdimage () {
            if (this.prefix && (this.val.indexOf('http') !== 0 || this.val.indexOf('blob:') === 0) && !this.uploadingImage) {
                return this.prefix + this.val
            }
            return ((this.val.indexOf('http') === 0 || this.val.indexOf('blob:') === 0) ? this.val : Admin.Url.upload(this.val))
        },
    }
}));
