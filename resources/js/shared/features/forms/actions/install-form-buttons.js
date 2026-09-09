import { bindFormButtons } from './form-buttons.js'

export const FORM_BUTTONS_COMPONENT = 'form-buttons'
export const FORM_BUTTONS_ROOT_SELECTOR = 'body'

export function installFormButtons(admin, options) {
    assertAdmin(admin)
    const definition = createFormButtonsDefinition(admin, options)
    admin.Components.register(definition)
    const scan = (root = options.document) => {
        return admin.Components.scan(root, FORM_BUTTONS_COMPONENT)
    }
    admin.Modules.register('form.buttons', () => scan())

    return { definition, scan }
}

export function createFormButtonsDefinition(admin, options) {
    return {
        mount: (body) =>
            bindFormButtons({
                document: body.ownerDocument,
                events: admin.Events,
                messages: admin.Messages,
                questions: options.questions,
                root: body,
                token: admin.token,
            }),
        name: FORM_BUTTONS_COMPONENT,
        selector: FORM_BUTTONS_ROOT_SELECTOR,
    }
}

function assertAdmin(admin) {
    if (typeof admin?.Components?.register !== 'function') {
        throw new TypeError('Form buttons require Admin.Components.')
    }
    if (typeof admin?.Modules?.register !== 'function') {
        throw new TypeError('Form buttons require Admin.Modules.')
    }
}
