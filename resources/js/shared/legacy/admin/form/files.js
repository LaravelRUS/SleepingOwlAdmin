const {
    installFiles,
} = require('../../../features/forms/files/install-files')

function uploadError(response) {
    const error = Array.isArray(response?.errors) ? response.errors[0] : null
    if (error) {
        Admin.Messages.error(response.message, error)
        return
    }

    Admin.Messages.error(trans('lang.ckeditor.upload.error.common'))
}

function promptLink(url) {
    return Admin.Messages.prompt(trans('lang.file.insert_link'), null, null, url, url).then(
        (result) => result.value,
    )
}

Admin.Files = installFiles(Admin, {
    notifications: { promptLink, uploadError },
})
