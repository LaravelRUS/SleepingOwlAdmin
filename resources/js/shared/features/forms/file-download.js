export async function downloadFile(url, options = {}) {
    const { document, fetch, urlApi } = downloadDependencies(options)
    assertDependencies(document, fetch, urlApi)

    const response = await fetch(url, { credentials: 'same-origin' })
    assertResponse(response)

    const objectUrl = urlApi.createObjectURL(await response.blob())
    const link = document.createElement('a')
    link.href = objectUrl
    link.download = downloadName(url, document.baseURI)
    link.hidden = true
    document.body.append(link)
    link.click()
    link.remove()
    globalThis.setTimeout(() => urlApi.revokeObjectURL(objectUrl), 0)
}

function downloadName(url, baseUrl) {
    try {
        const pathname = new globalThis.URL(url, baseUrl).pathname

        return decodeURIComponent(pathname.split('/').filter(Boolean).pop() ?? 'download')
    } catch {
        return 'download'
    }
}

function downloadDependencies(options) {
    const document = options.document ?? globalThis.document

    return {
        document,
        fetch: options.fetch ?? globalThis.fetch,
        urlApi: options.urlApi ?? document?.defaultView?.URL ?? globalThis.URL,
    }
}

function assertResponse(response) {
    if (response?.ok) return

    throw new Error(`File download failed with status ${response?.status ?? 0}.`)
}

function assertDependencies(document, fetch, urlApi) {
    if (!document?.body || typeof document.createElement !== 'function') {
        throw new TypeError('File download requires a document.')
    }
    if (typeof fetch !== 'function') throw new TypeError('File download requires fetch.')
    if (typeof urlApi?.createObjectURL !== 'function') {
        throw new TypeError('File download requires URL.createObjectURL().')
    }
}
