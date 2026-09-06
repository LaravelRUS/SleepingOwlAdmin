const { installTrees } = require('../../../../frontend/features/tree/install-trees')
const {
    createLegacyTreeNotifications,
} = require('../../../../frontend/features/tree/themes/legacy-adminlte/notifications')

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
