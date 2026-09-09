import { expect, it, vi } from 'vitest'

import {
    loadLazyImage,
    loadLazyImages,
} from '../../../../resources/js/shared/features/table/hooks/lazy-images.js'

it('moves lazy image sources to native loading attributes', () => {
    const attributes = new Map([
        ['data-src', '/image.jpg'],
        ['data-srcset', '/image-2x.jpg 2x'],
    ])
    const image = {
        getAttribute: (name) => attributes.get(name),
        setAttribute: vi.fn((name, value) => attributes.set(name, value)),
        tagName: 'IMG',
    }

    loadLazyImage(image)

    expect(image.loading).toBe('lazy')
    expect(image.setAttribute).toHaveBeenCalledWith('src', '/image.jpg')
    expect(image.setAttribute).toHaveBeenCalledWith('srcset', '/image-2x.jpg 2x')
})

it('scans only the supplied draw root', () => {
    const first = { getAttribute: vi.fn(), setAttribute: vi.fn(), tagName: 'IMG' }
    const second = { getAttribute: vi.fn(), setAttribute: vi.fn(), tagName: 'IMG' }
    const root = {
        matches: () => false,
        querySelectorAll: vi.fn(() => [first, second]),
    }

    expect(loadLazyImages(root)).toBe(2)
    expect(root.querySelectorAll).toHaveBeenCalledWith('.lazyload')
    expect(first.loading).toBe('lazy')
    expect(second.loading).toBe('lazy')
})
