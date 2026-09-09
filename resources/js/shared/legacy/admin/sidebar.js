const { installSidebar } = require('../../features/sidebar/install-sidebar')

Admin.Sidebar = installSidebar(Admin)
Admin.Modules.register('helpers.sidebar', () => Admin.Sidebar.scan())
