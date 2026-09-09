import { expect, it, vi } from 'vitest'

import { createRuntimeAssetLoader } from '../../../../resources/js/core/assets/runtime-assets.js'

function createElement(tagName) {
    return { tagName, href: '', rel: '', src: '', type: '' }
}

function createDocument(initial = {}) {
    const elements = {
        link: [...(initial.link ?? [])],
        script: [...(initial.script ?? [])],
    }
    const head = {
        appendChild: vi.fn((element) => {
            elements[element.tagName].push(element)
            globalThis.queueMicrotask(() => element.onload())
        }),
    }

    return {
        baseURI: 'https://admin.test/panel',
        createElement: vi.fn((tagName) => createElement(tagName)),
        elements,
        head,
        querySelectorAll: vi.fn((selector) =>
            selector.startsWith('script') ? elements.script : elements.link,
        ),
    }
}

function createImageFactory() {
    return vi.fn(() => {
        const image = {}
        Object.defineProperty(image, 'src', {
            set: () => {
                globalThis.queueMicrotask(() => image.onload())
            },
        })
        return image
    })
}

it('loads scripts once and resolves an already loaded URL', async () => {
    const document = createDocument()
    const log = vi.fn()
    const loader = createRuntimeAssetLoader({ document, createImage: vi.fn(), log })

    const first = loader.js('/runtime.js')
    const concurrent = loader.js('/runtime.js')
    expect(concurrent).toBe(first)
    await expect(first).resolves.toBe('/runtime.js')
    await expect(loader.js('/runtime.js')).resolves.toBe('/runtime.js')

    expect(document.elements.script).toHaveLength(1)
    expect(log).toHaveBeenCalledWith('Script file /runtime.js is loaded.')
})

it('loads a second stylesheet when another stylesheet already exists', async () => {
    const existing = { href: 'https://admin.test/first.css' }
    const document = createDocument({ link: [existing] })
    const loader = createRuntimeAssetLoader({ document, createImage: vi.fn() })

    await expect(loader.css('/second.css')).resolves.toBe('/second.css')
    await expect(loader.css('/second.css')).resolves.toBe('/second.css')

    expect(document.elements.link).toHaveLength(2)
    expect(document.elements.link[1]).toMatchObject({ rel: 'stylesheet', type: 'text/css' })
})

it('loads images and registers supported asset types', async () => {
    const document = createDocument()
    const createImage = createImageFactory()
    const loader = createRuntimeAssetLoader({ document, createImage })

    await expect(loader.img('/preview.svg')).resolves.toBe('/preview.svg')
    await expect(loader.register({ css: '/runtime.css', js: '/runtime.js' })).resolves.toEqual([
        '/runtime.css',
        '/runtime.js',
    ])

    expect(createImage).toHaveBeenCalledOnce()
})

it('diagnoses invalid runtime asset input', () => {
    const document = createDocument()
    const loader = createRuntimeAssetLoader({ document, createImage: vi.fn() })

    expect(() => loader.js('')).toThrow('non-empty string')
    expect(() => loader.register({ video: '/clip.mp4' })).toThrow('Unsupported runtime asset type')
    expect(() => createRuntimeAssetLoader({ document: null })).toThrow('require a document')
})
