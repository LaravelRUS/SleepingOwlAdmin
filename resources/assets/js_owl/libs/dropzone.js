/**
 * DropzoneJS is an open source library that provides drag’n’drop
 * file uploads with image previews.
 *
 * @see http://www.dropzonejs.com/
 */

window.Dropzone = require('dropzone');

Dropzone.autoDiscover = false;

Dropzone.prototype.defaultOptions.headers = {
    'X-CSRF-TOKEN': Admin.token
}
