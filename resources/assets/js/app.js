/**
 * First we will load all of this project's JavaScript dependencies which
 * include Vue and Vue Resource. This gives a great starting point for
 * building robust, powerful web applications using Vue and Laravel.
 */
require('./bootstrap');

/**
 * Initialize Wysiwyg editors
 */
require('./wysiwyg/ckeditor')
require('./wysiwyg/simplemde')
require('./wysiwyg/tinymce')

/**
 * Initialize display
 */
require('./admin/display/datatables')
require('./admin/display/actions')
require('./admin/display/treeview')
require('./admin/display/columns/checkbox')
require('./admin/display/columns/control')
require('./admin/display/columns/tree_control')
require('./admin/display/columns/inline_edit')

/**
 * Initialize form
 */
require('./admin/form/buttons')
require('./admin/form/datetime')
require('./admin/form/daterange')
require('./admin/form/select')
require('./admin/form/dependent-select')
require('./admin/form/file')
require('./admin/form/image')
require('./admin/form/images')

$(() => {
    require('./admin/events');

    Admin.Modules.init();

    var app = new Vue({
        el: 'body'
    });
})
