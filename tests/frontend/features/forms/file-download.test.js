import { expect, it, vi } from 'vitest'

import { downloadFile } from '../../../../resources/js/shared/features/forms/file-download.js'

it('fetches a file as a blob and starts a browser download without opening a window', async () => {
    const blob = { type: 'image/svg+xml' }
    const link = { click: vi.fn(), remove: vi.fn() }
    const document = {
        baseURI: 'https://admin.example.test/',
        body: { append: vi.fn() },
        createElement: vi.fn(() => link),
    }
    const fetch = vi.fn(async () => ({ blob: async () => blob, ok: true }))
    const urlApi = {
        createObjectURL: vi.fn(() => 'blob:download'),
        revokeObjectURL: vi.fn(),
    }

    await downloadFile('https://cdn.example.test/images/avatar.svg', {
        document,
        fetch,
        urlApi,
    })

    expect(fetch).toHaveBeenCalledWith('https://cdn.example.test/images/avatar.svg', {
        credentials: 'same-origin',
    })
    expect(urlApi.createObjectURL).toHaveBeenCalledWith(blob)
    expect(link).toMatchObject({ download: 'avatar.svg', hidden: true, href: 'blob:download' })
    expect(document.body.append).toHaveBeenCalledWith(link)
    expect(link.click).toHaveBeenCalledOnce()
    expect(link.remove).toHaveBeenCalledOnce()
})
