const { installTrees } = require('../../../features/tree/install-trees')
const {
    createLegacyTreeNotifications,
} = require('../../../../themes/adminlte/features/tree/notifications')

installTrees(Admin, {
    labels: {
        collapse: trans('lang.tree.collapse'),
        expand: trans('lang.tree.expand'),
    },
    notifications: createLegacyTreeNotifications(Swal, Admin.Messages, {
        error: trans('lang.table.error'),
        success: trans('lang.tree.reorderCompleted'),
    }),
})
