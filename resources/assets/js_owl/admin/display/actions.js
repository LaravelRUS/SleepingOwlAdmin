const {
    bindBulkActions,
} = require('../../../../frontend/features/table/actions/bulk-actions')
const {
    createLegacyActionCallbacks,
} = require('../../../../frontend/features/table/themes/legacy-adminlte/action-callbacks')

let unbind = null

Admin.Modules.register('display.actions', () => {
    unbind?.()
    unbind = bindBulkActions({
        callbacks: createLegacyActionCallbacks(),
        events: Admin.Events,
        http: Admin.Http,
        location: window.location,
        messages: Admin.Messages,
        notify: (settings) => Swal.fire(settings),
        root: document,
        tables: Admin.Tables,
        translate: trans,
    })
})
