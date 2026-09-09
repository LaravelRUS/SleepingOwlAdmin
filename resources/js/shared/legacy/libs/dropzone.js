/**
 * DropzoneJS is an open source library that provides drag’n’drop
 * file uploads with image previews.
 *
 * @see http://www.dropzonejs.com/
 */

const dropzoneModule = require('dropzone')
const Dropzone = dropzoneModule.Dropzone || dropzoneModule.default || dropzoneModule

Dropzone.autoDiscover = false;

if (Dropzone.prototype && Dropzone.prototype.defaultOptions) {
    Dropzone.prototype.defaultOptions.headers = {
        'X-CSRF-TOKEN': Admin.token
    }
}

window.Dropzone = Dropzone

module.exports = Dropzone
