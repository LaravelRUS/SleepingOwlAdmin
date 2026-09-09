import { createRuntimeAssetLoader } from '../assets/runtime-assets.js'
import { parseBoolean, parseJsonProps, parseNumber, readDataset } from '../data/island-props.js'
import { createPostForm, submitForm, submitPostForm } from '../dom/forms.js'
import { delegate, listen } from '../dom/listeners.js'
import { createEventBus } from '../events/event-bus.js'
import { readCsrfToken } from '../http/csrf-token.js'
import { createHttpClient } from '../http/http-client.js'
import { createComponentLifecycle } from '../lifecycle/component-lifecycle.js'
import { createStorageRepository } from '../storage/storage-repository.js'
import { createTableRegistry } from '../tables/table-registry.js'

const DATA_API = Object.freeze({ parseBoolean, parseJsonProps, parseNumber, readDataset })
const DOM_API = Object.freeze({ createPostForm, delegate, listen, submitForm, submitPostForm })

export function createAdminCore(options = {}) {
    const document = options.document ?? globalThis.document

    return {
        Asset: createRuntimeAssetLoader({
            createImage: options.createImage,
            document,
            log: options.assetLog,
        }),
        Components: createComponentLifecycle(),
        Data: DATA_API,
        DOM: DOM_API,
        Events: createEventBus(document),
        Http: createHttpClient({
            csrfToken: options.csrfToken ?? readCsrfToken(document),
            fetch: options.fetch ?? globalThis.fetch,
        }),
        Storage: createStorageRepository(options.storage ?? globalThis.localStorage),
        Tables: createTableRegistry(),
    }
}

export function installAdminCore(target = globalThis, options = {}) {
    assertTarget(target)

    const admin = adminNamespace(target)
    const services = createAdminCore({ ...targetOptions(target), ...options })
    Object.entries(services).forEach(([name, service]) => {
        if (!(name in admin)) admin[name] = service
    })
    target.Admin = admin

    return admin
}

function adminNamespace(target) {
    const admin = target.Admin ?? {}
    if ((typeof admin !== 'object' || admin === null) && typeof admin !== 'function') {
        throw new TypeError('Existing Admin namespace must be an object.')
    }

    return admin
}

function targetOptions(target) {
    const Image = safeProperty(target, 'Image')
    const fetch = safeProperty(target, 'fetch')

    return {
        createImage: typeof Image === 'function' ? () => new Image() : undefined,
        document: safeProperty(target, 'document'),
        fetch: typeof fetch === 'function' ? fetch.bind(target) : fetch,
        storage: safeProperty(target, 'localStorage'),
    }
}

function safeProperty(target, name) {
    try {
        return target[name]
    } catch {
        return undefined
    }
}

function assertTarget(target) {
    if (!target || (typeof target !== 'object' && typeof target !== 'function')) {
        throw new TypeError('Admin core target must be an object.')
    }
}
