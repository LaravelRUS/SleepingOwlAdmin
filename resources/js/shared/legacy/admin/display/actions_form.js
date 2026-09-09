const {
    bindFormActions,
} = require('../../../features/table/actions/form-actions')
const {
    createNamedActionCallbacks,
} = require('../../../features/table/actions/named-action-callbacks')

let unbind = null

Admin.Modules.register('display.actions_form', () => {
    unbind?.()
    unbind = bindFormActions({
        callbacks: createNamedActionCallbacks(),
        events: Admin.Events,
        FormData: window.FormData,
        http: Admin.Http,
        messages: Admin.Messages,
        notify: (settings) => Swal.fire(settings),
        root: document,
        tables: Admin.Tables,
        translate: trans,
    })
})
