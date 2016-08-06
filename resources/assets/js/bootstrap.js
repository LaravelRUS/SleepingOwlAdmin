/**
 * Underscore
 */
window._ = require('underscore');

require('./libs/jquery')
require('./libs/moment')
require('./libs/i18next')
require('./libs/bootstrap')
require('./libs/noty')
require('./libs/bootbox')
require('./libs/select2')
require('./libs/datetimepicker')
require('./libs/xeditable')
require('./libs/ekkolightbox')
require('./libs/flow')
//require('./libs/dropzone')
require('./libs/datatables')
require('./libs/metismenu')
require('./libs/nestable')
require('./libs/sweetalert')

/**
 * Admin-LTE
 */
require('admin-lte')

/**
 * Vue is a modern JavaScript for building interactive web interfaces using
 * reacting data binding and reusable components. Vue's API is clean and
 * simple, leaving you to focus only on building your next great idea.
 */
require('./libs/vuejs')

/**
 * Components
 */
window.Admin.log = (error) => {
    console.log(error)
}

window.Admin.Messages = require('./components/messages');
window.Admin.WYSIWYG = require('./components/wysiwyg');

