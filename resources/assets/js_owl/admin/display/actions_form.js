const {
    bindFormActions,
} = require('../../../../frontend/features/table/actions/form-actions')
const {
    createLegacyActionCallbacks,
} = require('../../../../frontend/features/table/themes/legacy-adminlte/action-callbacks')

let unbind = null

Admin.Modules.register('display.actions_form', () => {
    unbind?.()
    unbind = bindFormActions({
        callbacks: createLegacyActionCallbacks(),
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
