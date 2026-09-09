export function tableBrowserOptions(target) {
    const translate = (key) => translated(target, key, key)

    return {
        actions: {
            FormData: target.FormData,
            location: target.location,
            notify: (settings) => target.Swal.fire(settings),
            translate,
        },
        controls: {
            questions: {
                delete: translated(target, 'lang.table.delete-confirm', 'Delete?'),
                destroy: translated(target, 'lang.table.destroy-confirm', 'Destroy?'),
            },
        },
        inlineEditor: {
            labels: {
                cancel: translated(target, 'lang.button.cancel', 'Cancel'),
                error: translated(target, 'lang.table.error', 'Table error'),
                save: translated(target, 'lang.button.save', 'Save'),
            },
        },
        onError: (settings) => reportTableError(target, settings),
    }
}

function reportTableError(target, settings) {
    const message =
        settings?.jqXHR?.responseJSON?.message ??
        translated(target, 'lang.table.error', 'Table error')

    return target.Admin.Messages.error(message)
}

function translated(target, key, fallback) {
    if (typeof target.trans !== 'function') return fallback

    const value = target.trans(key)

    return typeof value === 'string' && value !== key ? value : fallback
}
