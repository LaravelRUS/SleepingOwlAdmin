const {
    bindBulkActions,
} = require('../../../../frontend/features/table/actions/bulk-actions')
const {
    createNamedActionCallbacks,
} = require('../../../../frontend/features/table/actions/named-action-callbacks')

let unbind = null

Admin.Modules.register('display.actions', () => {
    unbind?.()
    unbind = bindBulkActions({
        callbacks: createNamedActionCallbacks(),
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
