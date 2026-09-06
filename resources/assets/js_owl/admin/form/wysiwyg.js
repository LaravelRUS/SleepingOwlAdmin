const {
    installWysiwyg,
} = require('../../../../frontend/features/forms/wysiwyg/install-wysiwyg')

const feature = installWysiwyg(Admin)
Admin.WYSIWYG.scan = feature.scan
