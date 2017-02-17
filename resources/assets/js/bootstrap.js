import Admin from './components/admin';

window._ = require('lodash');

window.Admin = new Admin(
    document.querySelector("meta[name='csrf-token']").getAttribute('content'),
    window.GlobalConfig || {}
)

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

window.Admin.Messages = require('./components/messages')
window.Admin.Storage = require('./components/storage')
window.Admin.Asset = require('./components/asset')
window.Admin.Modules = require('./components/modules')
window.Admin.WYSIWYG = require('./components/wysiwyg')

