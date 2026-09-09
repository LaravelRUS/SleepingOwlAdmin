const { installTooltips } = require('../../features/tooltip/install-tooltips')

Admin.Tooltips = installTooltips(Admin)
Admin.Modules.register('helpers.tooltip', () => Admin.Tooltips.scan())
