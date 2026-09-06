import { describe, expect, it, vi } from 'vitest'

import { createWysiwygRegistry } from '../../../../resources/frontend/features/forms/wysiwyg/wysiwyg-registry.js'

function eventRecorder() {
    const calls = []

    return {
        calls,
        events: { fire: (...args) => calls.push(args) },
    }
}

describe('WYSIWYG registry lifecycle', () => {
    it('preserves register, get, exec and switch events for synchronous editors', async () => {
        const { calls, events } = eventRecorder()
        const editor = { destroy: vi.fn(), insert: vi.fn() }
        const registry = createWysiwygRegistry({ events })
        const off = vi.fn((instance) => instance.destroy())
        const exec = vi.fn((instance, command, _id, data) => instance[command](data))

        expect(registry.register('custom', () => editor, off, exec)).toBe(true)
        await expect(registry.switchOn('body', 'custom', { toolbar: false })).resolves.toBe(editor)
        expect(registry.get('body')[0]).toBe('custom')
        expect(registry.editor('body')).toBe(editor)
        registry.exec('body', 'insert', 'Text')
        expect(editor.insert).toHaveBeenCalledWith('Text')
        await expect(registry.switchOff('body')).resolves.toBe(true)
        expect(off).toHaveBeenCalledWith(editor, 'body')
        expect(calls.map(([name]) => name)).toEqual([
            'wysiwyg:switchOn',
            'wysiwyg:exec',
            'wysiwyg:switchOff',
        ])
    })
})

describe('WYSIWYG registry async behavior', () => {
    it('normalizes editor arrays and destroys a pending editor before replacement', async () => {
        let resolveEditor
        const first = { destroy: vi.fn() }
        const second = { destroy: vi.fn() }
        const registry = createWysiwygRegistry()
        registry.register(
            'async',
            () => new Promise((resolve) => (resolveEditor = resolve)),
            (editor) => editor.destroy(),
        )
        registry.register(
            'next',
            () => second,
            (editor) => editor.destroy(),
        )

        const pending = registry.switchOn('body', 'async')
        const replacement = registry.switchOn('body', 'next')
        await Promise.resolve()
        resolveEditor([first])

        await expect(pending).resolves.toBe(first)
        await expect(replacement).resolves.toBe(second)
        expect(first.destroy).toHaveBeenCalledOnce()
        expect(registry.editor('body')).toBe(second)
    })

    it('logs unknown and invalid adapters without throwing from page boot', async () => {
        const log = vi.fn()
        const registry = createWysiwygRegistry({ log })

        expect(registry.register('broken')).toBe(false)
        await expect(registry.switchOn('body', 'missing')).resolves.toBeNull()
        expect(log).toHaveBeenCalledTimes(2)
    })
})
