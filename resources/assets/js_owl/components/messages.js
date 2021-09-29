module.exports = (function () {

    return {

        /**
         * Error message output
         *
         * @param {String} title
         * @param {String} message
         * @returns {*}
         */
        error(title, message) {
            return this.message(title, message, "error")
        },

        /**
         * Success message output
         *
         * @param {String} title
         * @param {String} message
         * @returns {*}
         */
        success(title, message) {
            return this.message(title, message, "success")
        },

        /**
         * Message output
         *
         * @param {String} title
         * @param {String} message
         * @param {String} icon Message icon (error, success)
         * @returns {*}
         */
        message(title, message, icon) {
            return Swal.fire(title, message, icon || 'success')
        },

        /**
         * Confirmation message
         *
         * @param {String} title
         * @param {String} message
         * @param {Object} id
         */
        confirm(title, message, id) {

            let settings = {
                title: title,
                text: message || '',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3c8dbc',
                cancelButtonColor: '#d33',
                confirmButtonText: trans('lang.button.yes'),
                cancelButtonText: trans('lang.button.cancel')
            };



            Admin.Events.fire("datatables::confirm::init", settings, id);

            return Swal.fire(settings)
        },

        /**
         * Displaying a message with an input field
         *
         * @param {String} title
         * @param {String} message
         * @param {Function} callback Code executed when confirmation
         * @param {String} inputPlaceholder Placeholder
         * @param {String} inputValue Default value in input field
         * @param {String} imageUrl Show Image on this link
         */
        prompt(title, message, inputPlaceholder, inputValue, imageUrl) {
            return Swal.fire({
                title: title,
                text: message || '',
                input: 'text',
                showCancelButton: true,
                inputPlaceholder: inputPlaceholder || '',
                inputValue: inputValue || '',
                imageUrl: imageUrl || '',
                confirmButtonText: trans('lang.button.yes'),
                cancelButtonText: trans('lang.button.cancel')
            })
        },

        cliptobuffer(title, message, inputPlaceholder, inputValue, imageUrl) {
            return Swal.fire({
                title: title,
                text: message || '',
                input: 'text',
                showCancelButton: true,
                inputPlaceholder: inputPlaceholder || '',
                inputValue: inputValue || '',
                imageUrl: imageUrl || '',
                confirmButtonText: trans('lang.button.yes'),
                cancelButtonText: trans('lang.button.cancel'),
                didOpen: () => {

                  const field = Swal.getContainer().getElementsByClassName('swal2-input')[0]
                  const image = Swal.getContainer().getElementsByClassName('swal2-image')[0]
                  var blob = null
                  var link = null

                  //create hidden input
                  var input = document.createElement('img')
                  input.setAttribute('id', 'image-paste-in-buffer')
                  input.classList.add('hidden')
                  document.getElementById('vueApp').appendChild(input)

                  field.onpaste = function (event) {
                    // use event.originalEvent.clipboard for newer chrome versions
                    var items = (event.clipboardData  || event.originalEvent.clipboardData).items;
                    var text = (event.clipboardData  || event.originalEvent.clipboardData).getData('Text');

                    if (link) {
                      // удаляем старый блоб файл
                      URL.revokeObjectURL(link)
                      link = null
                    }

                    // console.log(JSON.stringify(items)); // will give you the mime types
                    // find pasted image among pasted items
                    for (var i = 0; i < items.length; i++) {
                      if (items[i].type.indexOf("image") === 0) {
                        blob = items[i].getAsFile()
                        var arr = [
                          {ext: 'ico', mime: 'image/x-icon'},
                          {ext: 'ico', mime: 'image/vnd.microsoft.icon'},

                          {ext: 'jpg', mime: 'image/jpeg'},
                          {ext: 'jpg', mime: 'image/pjpeg'},
                          {ext: 'jpg', mime: 'image/x-citrix-jpeg'},
                          {ext: 'jpg2', mime: 'image/jp2'},
                          {ext: 'jpm', mime: 'image/jpm'},
                          {ext: 'jpx', mime: 'image/jpx'},

                          {ext: 'png', mime: 'image/png'},
                          {ext: 'png', mime: 'image/x-png'},

                          {ext: 'bmp', mime: 'image/bmp'},

                          {ext: 'tif', mime: 'image/tiff'},
                          {ext: 'svg', mime: 'image/svg+xml'},
                          {ext: 'gif', mime: 'image/gif'},
                          {ext: 'wbmp', mime: 'image/vnd.wap.wbmp'},
                          {ext: 'webp', mime: 'image/webp'},
                        ]
                        extention = arr.find(el => el.mime == items[i].type)
                        if (extention) {
                          input.setAttribute('data-ext', extention.ext)
                        }

                      }
                    }

                    // load image if there is a pasted image
                    if (blob !== null) {
                      var reader = new FileReader();
                      reader.onload = function(event) {
                        input.setAttribute('src', event.target.result)
                        link = window.URL.createObjectURL(blob)
                        input.setAttribute('name', link)
                        // image.src = event.target.result
                        // field.value = event.target.result
                        image.src = link
                        field.value = link
                        image.style.display = 'block'
                      };
                      reader.readAsDataURL(blob);
                    } else if(text) {
                      image.src = text
                      image.style.display = 'block'
                    }
                  }

                }
            }).then((result) => {
              if (result.isDismissed) {
                input = document.getElementById('image-paste-in-buffer')
                if (input) {
                  if (input.name) {
                    window.URL.revokeObjectURL(input.name)
                  }
                  input.remove()
                }
                return false
              }
              return result
            })
        },
    }

})()
