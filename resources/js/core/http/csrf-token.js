export function readCsrfToken(document = globalThis.document) {
    const content = document?.querySelector?.('meta[name="csrf-token"]')?.getAttribute('content')

    return typeof content === 'string' && content.length > 0 ? content : null
}
