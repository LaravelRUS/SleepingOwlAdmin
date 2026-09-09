import { installAdminCore } from '../../core/runtime/admin-core';
import { installCompatibilityRuntime } from '../compatibility/runtime';

installAdminCore(window);
installCompatibilityRuntime(window);

//
// window.Trix = require('trix');

require('./libs/dropzone');
const {
    dataTableEngineRuntime,
} = require('../features/table/engine/data-table-engine');
const {
    installLegacyDataTablesPresentation,
} = require('../../themes/adminlte/features/table/datatables');
installLegacyDataTablesPresentation(dataTableEngineRuntime());
require('./libs/progressbar');
require('./libs/lazyload');

require('./admin/alert');
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
