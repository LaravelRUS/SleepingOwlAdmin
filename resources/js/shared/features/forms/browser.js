import { installFormButtons } from './actions/install-form-buttons.js'
import { fileNotifications, formButtonQuestions } from './browser-options.js'
import { installDateControls } from './date/install-date-controls.js'
import { installFiles } from './files/install-files.js'
import { installPasswordControls } from './generation/password-control.js'
import { installTextGenerators } from './generation/text-control.js'
import { installWysiwygAdapters } from './wysiwyg/install-wysiwyg-adapters.js'
import { installWysiwyg } from './wysiwyg/install-wysiwyg.js'

if (globalThis.document) bootForms(globalThis)

export function bootForms(target) {
    const admin = requireCompatibility(target.Admin)
    installWysiwygAdapters(admin.WYSIWYG, target)
    const features = installFeatures(target, admin)
    const forms = createFormsRuntime(features, target.document)

    admin.Forms = forms
    admin.WYSIWYG.scan = features.wysiwyg.scan
    forms.scan()

    return forms
}

function installFeatures(target, admin) {
    const root = target.document

    return {
        buttons: installFormButtons(admin, {
            document: root,
            questions: formButtonQuestions(target),
        }),
        dates: installDateControls(admin, { root }),
        files: installFiles(admin, { notifications: fileNotifications(target), root }),
        passwords: installPasswordControls(admin, { root }),
        text: installTextGenerators(admin, { root }),
        wysiwyg: installWysiwyg(admin, { root }),
    }
}

function createFormsRuntime(features, root) {
    return {
        features: Object.freeze({ ...features }),
        scan(scanRoot = root) {
            return Object.values(features).reduce(
                (count, feature) => count + feature.scan(scanRoot),
                0,
            )
        },
    }
}

function requireCompatibility(admin) {
    if (!admin?.Modules || !admin?.Messages || !admin?.WYSIWYG) {
        throw new TypeError('Forms require the SleepingOwl compatibility runtime.')
    }

    return admin
}
