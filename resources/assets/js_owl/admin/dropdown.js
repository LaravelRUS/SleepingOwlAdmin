const { installDropdowns } = require('../../../frontend/features/dropdown/install-dropdowns')

Admin.Dropdowns = installDropdowns(Admin)
Admin.Modules.register('helpers.dropdown', () => Admin.Dropdowns.scan())
