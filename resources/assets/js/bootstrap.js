window.Admin.Settings.token = document.querySelector("meta[name='csrf-token']").getAttribute('content')

/**
 * Underscore is a JavaScript library that provides a whole mess of useful
 * functional programming helpers without extending any built-in objects.
 * It’s the answer to the question: “If I sit down in front of a blank HTML
 * page, and want to start being productive immediately, what do I need?”
 *
 * @see http://underscorejs.org
 */
window._ = require('underscore');

window.Admin.Events = require('./components/events');

require('./libs/jquery')
require('./libs/moment')
require('./libs/i18next')
require('./libs/bootstrap')
require('./libs/noty')
require('./libs/select2')
require('./libs/datetimepicker')
require('./libs/daterangepicker')
require('./libs/xeditable')
require('./libs/magnific-popup')
require('./libs/dropzone')
require('./libs/datatables')
require('./libs/metismenu')
require('./libs/nestable')
require('./libs/sweetalert')
require('./libs/dependent-dropdown')

/**
 * Best open source admin dashboard & control panel theme.
 * Built on top of Bootstrap 3, AdminLTE provides a range of
 * responsive, reusable, and commonly used components.
 *
 * @see https://almsaeedstudio.com/preview
 */
require('admin-lte')

require('./libs/vuejs')

/**
 * Components
 */
window.Admin.log = (error) => {
    console.log(error)
}

window.Admin.Messages = require('./components/messages');
window.Admin.Modules = require('./components/modules');
window.Admin.WYSIWYG = require('./components/wysiwyg');

