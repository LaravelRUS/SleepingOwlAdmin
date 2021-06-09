/**
 * DropzoneJS is an open source library that provides drag’n’drop
 * file uploads with image previews.
 *
 * @see http://www.dropzonejs.com/
 */
import Dropzone from "dropzone/src/dropzone.js";

window.Dropzone = Dropzone

Dropzone.autoDiscover = false;

Dropzone.options.headers = {
    'X-CSRF-TOKEN': Admin.token
}
