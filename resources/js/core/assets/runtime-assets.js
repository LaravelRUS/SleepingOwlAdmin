const SUPPORTED_ASSET_TYPES = new Set(['css', 'img', 'js'])

export function createRuntimeAssetLoader({
    document = globalThis.document,
    createImage = () => new globalThis.Image(),
    log = () => {},
} = {}) {
    assertDocument(document)
    assertFunction(createImage, 'Image factory')
    assertFunction(log, 'Asset logger')

    const pending = new Map()
    const loader = {
        css: (url) => loadStylesheet(document, url, log, pending),
        img: (url) => loadImage(createImage, url),
        js: (url) => loadScript(document, url, log, pending),
        register: (assets) => registerAssets(loader, assets),
    }

    return loader
}

function registerAssets(loader, assets) {
    if (!assets || typeof assets !== 'object') {
        return Promise.resolve([])
    }

    return Promise.all(
        Object.entries(assets).map(([type, url]) => {
            if (!SUPPORTED_ASSET_TYPES.has(type)) {
                throw new TypeError(`Unsupported runtime asset type: ${type}.`)
            }

            return loader[type](url)
        }),
    )
}

function loadScript(document, url, log, pending) {
    assertUrl(url)

    const key = assetKey(document, 'js', url)
    if (pending.has(key)) {
        return pending.get(key)
    }
    if (hasMatchingUrl(document, 'script[src]', 'src', url)) {
        log(`Script file ${url} is loaded.`)
        return Promise.resolve(url)
    }

    const script = document.createElement('script')
    script.src = url

    return trackPending(pending, key, appendAndWait(document.head, script, url))
}

function loadStylesheet(document, url, log, pending) {
    assertUrl(url)

    const key = assetKey(document, 'css', url)
    if (pending.has(key)) {
        return pending.get(key)
    }
    if (hasMatchingUrl(document, 'link[href]', 'href', url)) {
        log(`CSS file ${url} is loaded.`)
        return Promise.resolve(url)
    }

    const link = document.createElement('link')
    link.href = url
    link.rel = 'stylesheet'
    link.type = 'text/css'

    return trackPending(pending, key, appendAndWait(document.head, link, url))
}

function loadImage(createImage, url) {
    assertUrl(url)

    const image = createImage()
    const loaded = waitForLoad(image, url)
    image.src = url

    return loaded
}

function appendAndWait(parent, element, url) {
    const loaded = waitForLoad(element, url)
    parent.appendChild(element)

    return loaded
}

function waitForLoad(element, url) {
    return new Promise((resolve, reject) => {
        element.onload = () => resolve(url)
        element.onerror = () => {
            element.remove?.()
            reject(url)
        }
    })
}

function trackPending(pending, key, promise) {
    pending.set(key, promise)
    void promise.then(
        () => pending.delete(key),
        () => pending.delete(key),
    )

    return promise
}

function assetKey(document, type, url) {
    return `${type}:${absoluteUrl(document, url)}`
}

function hasMatchingUrl(document, selector, property, url) {
    const expected = absoluteUrl(document, url)

    return [...document.querySelectorAll(selector)].some(
        (element) => absoluteUrl(document, element[property]) === expected,
    )
}

function absoluteUrl(document, url) {
    return new globalThis.URL(url, document.baseURI).href
}

function assertDocument(document) {
    if (!document?.head || typeof document.createElement !== 'function') {
        throw new TypeError('Runtime assets require a document with a head element.')
    }

    if (typeof document.querySelectorAll !== 'function') {
        throw new TypeError('Runtime assets require document.querySelectorAll().')
    }
}

function assertUrl(url) {
    if (typeof url !== 'string' || url.length === 0) {
        throw new TypeError('Runtime asset URL must be a non-empty string.')
    }
}

function assertFunction(value, label) {
    if (typeof value !== 'function') {
        throw new TypeError(`${label} must be a function.`)
    }
}
