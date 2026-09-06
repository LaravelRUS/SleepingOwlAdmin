const { installTooltips } = require('../../../frontend/features/tooltip/install-tooltips')

Admin.Tooltips = installTooltips(Admin)
Admin.Modules.register('helpers.tooltip', () => Admin.Tooltips.scan())
