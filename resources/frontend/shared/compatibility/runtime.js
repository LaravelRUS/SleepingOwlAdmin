import axios from 'axios'
import lodash from 'lodash'
import Swal from 'sweetalert2'

import LegacyAdmin from '../../../assets/js_owl/components/admin'
import legacyMessages from '../../../assets/js_owl/components/messages'
import legacyModules from '../../../assets/js_owl/components/modules'
import { createWysiwygRegistry } from '../../features/forms/wysiwyg/wysiwyg-registry'
import { createTranslator } from './translator'

const INSTALLATION = Symbol.for('sleepingowl.shared.compatibility')

export function installCompatibilityRuntime(target) {
    if (target[INSTALLATION]) return target.Admin

    const core = requireCore(target.Admin)
    target._ = lodash
    target.axios = configuredAxios()
    target.Swal = Swal
    target.Admin = createLegacyAdmin(target, core)
    target.trans = createTranslator({ lang: target.Admin.Config.get('lang') })
    installLegacyServices(target.Admin)
    target[INSTALLATION] = true

    return target.Admin
}

function createLegacyAdmin(target, core) {
    const token = target.document?.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
    const admin = new LegacyAdmin(token ?? '', target.GlobalConfig ?? {})

    Object.assign(admin, core)

    return admin
}

function installLegacyServices(admin) {
    admin.Messages = legacyMessages
    admin.Modules = legacyModules
    admin.WYSIWYG = createWysiwygRegistry({
        events: admin.Events,
        log: (message, scope) => admin.log(message, scope),
    })
}

function configuredAxios() {
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

    return axios
}

function requireCore(admin) {
    if (!admin?.Components || !admin?.Events || !admin?.Http) {
        throw new TypeError('SleepingOwl compatibility runtime requires the headless core.')
    }

    return admin
}
