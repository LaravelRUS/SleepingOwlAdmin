import { expect, it, vi } from 'vitest'

import {
    createAdminCore,
    installAdminCore,
} from '../../../../resources/js/core/runtime/admin-core.js'

function documentFixture() {
    const document = new globalThis.EventTarget()
    document.baseURI = 'https://admin.test/'
    document.body = { appendChild: vi.fn() }
    document.contains = () => false
    document.createElement = () => ({})
    document.head = { appendChild: vi.fn() }
    document.querySelector = () => ({ getAttribute: () => 'csrf-token' })
    document.querySelectorAll = () => []

    return document
}

function memoryStorage() {
    const values = new Map()

    return {
        get length() {
            return values.size
        },
        getItem: (key) => values.get(key) ?? null,
        key: (index) => [...values.keys()][index] ?? null,
        removeItem: (key) => values.delete(key),
        setItem: (key, value) => values.set(key, String(value)),
    }
}

function environment() {
    return {
        createImage: () => ({}),
        document: documentFixture(),
        fetch: vi.fn(async () => ({ ok: true })),
        storage: memoryStorage(),
    }
}

it('creates one framework-neutral service namespace', () => {
    const core = createAdminCore(environment())

    expect(Object.keys(core)).toEqual([
        'Asset',
        'Components',
        'Data',
        'DOM',
        'Events',
        'Http',
        'Storage',
        'Tables',
    ])
    expect(core.Data.parseNumber('2')).toBe(2)
    expect(typeof core.DOM.delegate).toBe('function')
    expect(core.Http.csrfToken).toBe('csrf-token')
})

it('installs into an existing Admin object without replacing prior services', () => {
    const existingEvents = { legacy: true }
    const target = { Admin: { Events: existingEvents } }
    const first = installAdminCore(target, environment())
    const installedComponents = first.Components
    const second = installAdminCore(target, environment())

    expect(first).toBe(target.Admin)
    expect(second).toBe(first)
    expect(second.Events).toBe(existingEvents)
    expect(second.Components).toBe(installedComponents)
    expect(second.Http.csrfToken).toBe('csrf-token')
})
