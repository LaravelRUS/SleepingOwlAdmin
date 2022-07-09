import Admin from './components/admin'

// "use strict";
const d = document
const w = window


w._ = require('lodash')

w.Admin = new Admin(
    d.querySelector(`meta[name="csrf-token"]`).getAttribute('content'),
    w.GlobalConfig || {},
)

w.axios = require('axios')
w.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'



// Main
require('./libs/vuejs')
require('./libs/i18next')
require('./_main-lib/js-cookie')


// For All templates
require('./_main/clearLocal')
require('./_main/sidebar')
require('./_main/scroll-to-top')


// Libs (for all)
require('./libs/sweetalert')


// Only this template





// require('./libs/select2'); //-- jQuery
// require('./libs/noty');  //-- заменен на toast
//
// require('./libs/jquery'); //--
// // require('./libs/jquery-form');
// require('./libs/moment');
// require('./libs/bootstrap'); //-- подключен отдельно
//
// require('./libs/datetimepicker');
// require('./libs/daterangepicker');
// require('./libs/magnific-popup');
// require('./libs/dropzone');
// require('./libs/datatables');
require('./libs/datatables-new');

// require('./libs/xeditable');
// require('./libs/nestable');

// require('./libs/dependent-dropdown');
// require('./libs/progressbar');
// require('@flowjs/flow.js');
require('./libs/lazyload');


//
// /**
//  * Best open source admin dashboard & control panel theme.
//  * Built on top of Bootstrap 4, AdminLTE provides a range of
//  * responsive, reusable, and commonly used components.
//  *
//  * @see https://adminlte.io/themes/AdminLTE/
//  */
// require('admin-lte');
//
//


/**
 * Enabled Admin components
 */
w.Admin.Events = require('./components/events');
w.Admin.Messages = require('./components/messages');
w.Admin.Storage = require('./components/storage');
w.Admin.Asset = require('./components/asset');
w.Admin.Modules = require('./components/modules');
w.Admin.WYSIWYG = require('./components/wysiwyg');

// /**
//  * Initialize Wysiwyg editors
//  */
// require('./wysiwyg/ckeditor');
// require('./wysiwyg/ckeditor5');
// require('./wysiwyg/simplemde');
// require('./wysiwyg/tinymce');
// require('./wysiwyg/summernote');
//
// /**
//  * Initialize App
//  */
//
// /**
//  * Initialize display
//  */
// require('./admin/display/datatables');
require('./admin/display/datatables-new');
// require('./admin/display/table');
//
// require('./admin/display/actions');
// require('./admin/display/actions_form');
// require('./admin/display/treeview');
// require('./admin/display/columns/checkbox');
// require('./admin/display/columns/control');
// require('./admin/display/columns/tree_control');
// require('./admin/display/columns/inline_edit');
// require('./admin/tooltip');
//
// //localStorage
// require('./admin/localstorage/tabs');
//
//
// /**
//  * Initialize form
//  */
//  require('./admin/form/date');
//  require('./admin/form/datetime');
//  require('./admin/form/daterange');
//  require('./admin/form/deselect');
//  require('./admin/form/file');
//  require('./admin/form/files');
//  require('./admin/form/image');
//  require('./admin/form/images');
//  // require('./components/trix');
//
//
// //OLD need test
// require('./admin/form/buttons');
// require('./admin/form/select');
// require('./admin/form/selectajax');
// require('./admin/form/wysiwyg');
// require('./admin/form/dependent-select');
// require('./admin/display/env_editor');
// require('./admin/form/related');
