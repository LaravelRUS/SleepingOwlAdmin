const { installAlerts } = require('../../features/alert/install-alerts')

Admin.Alerts = installAlerts(Admin)
Admin.Modules.register('helpers.alert', () => Admin.Alerts.scan())
