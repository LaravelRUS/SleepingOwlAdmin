const {
    installWysiwyg,
} = require('../../../features/forms/wysiwyg/install-wysiwyg')

const feature = installWysiwyg(Admin)
Admin.WYSIWYG.scan = feature.scan
