import Admin from './components/admin';
import { installAdminCore } from '../../frontend/core/runtime/admin-core';

window._ = require('lodash');

window.Admin = new Admin(
    document.querySelector(`meta[name="csrf-token"]`).getAttribute('content'),
    window.GlobalConfig || {},
);

window.axios = require('axios');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

//
// window.Trix = require('trix');

require('./libs/noty');

require('./libs/jquery');
// require('./libs/jquery-form');
require('./libs/bootstrap');
require('./libs/i18next');

require('./libs/dropzone');
const {
    dataTables2Runtime,
} = require('../../frontend/features/table/engine/datatables2');
const {
    installLegacyDataTablesPresentation,
} = require('../../frontend/features/table/themes/legacy-adminlte/datatables');
installLegacyDataTablesPresentation(dataTables2Runtime());
require('./libs/sweetalert');
require('./libs/progressbar');
require('./libs/noty');
require('./libs/lazyload');

installAdminCore(window);
window.Admin.Messages = require('./components/messages');
window.Admin.Modules = require('./components/modules');


window.Admin.WYSIWYG = require('./components/wysiwyg');

require('./admin/tooltip');
require('./admin/dropdown');
require('./admin/sidebar');

/**
 * Initialize Wysiwyg editors
 */
require('./wysiwyg/ckeditor');
require('./wysiwyg/ckeditor5');
require('./wysiwyg/simplemde');
require('./wysiwyg/tinymce');

/**
 * Initialize App
 */

/**
 * Initialize display
 */
require('./admin/display/datatables');
require('./admin/display/table');
require('./admin/display/themes');
require('./admin/display/autoupdate');

require('./admin/display/actions');
require('./admin/display/actions_form');
require('./admin/display/lightbox');
require('./admin/display/treeview');
require('./admin/display/columns/checkbox');
require('./admin/display/columns/control');
require('./admin/display/columns/tree_control');
require('./admin/display/columns/inline_edit');
require('./components/scrolltotop');

//localStorage
require('./admin/localstorage/tabs');


/**
 * Initialize form
 */
 require('./admin/form/date-controls');
 require('./admin/form/files');
 // require('./components/trix');


//OLD need test
require('./admin/form/buttons');
require('./admin/form/wysiwyg');
require('./admin/form/password');
require('./admin/form/text');
