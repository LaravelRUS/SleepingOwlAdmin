import { describe, expect, it } from 'vitest'

import {
    inlineEditErrorMessage,
    inlineEditParameters,
    InlineEditRejectedError,
    normalizeInlineEditResponse,
} from '../../../../resources/js/shared/features/table/editing/inline-editor-request.js'

describe('inline edit request contract', () => {
    it('preserves scalar and checklist wire fields', () => {
        const config = { name: 'status', pk: '17' }
        expect(Object.fromEntries(inlineEditParameters(config, 'published'))).toEqual({
            name: 'status',
            pk: '17',
            value: 'published',
        })
        expect([...inlineEditParameters(config, ['1', '3'])]).toEqual([
            ['name', 'status'],
            ['pk', '17'],
            ['value[]', '1'],
            ['value[]', '3'],
        ])
    })

    it('sends an explicit empty value when every checklist option is cleared', () => {
        const config = { name: 'status', pk: '17' }

        expect([...inlineEditParameters(config, [])]).toEqual([
            ['name', 'status'],
            ['pk', '17'],
            ['value', ''],
        ])
    })
})

describe('inline edit response contract', () => {
    it('accepts boolean/string success and rejects application failures', () => {
        expect(normalizeInlineEditResponse({ status: true, newValue: 'Published' }, 'Draft')).toBe(
            'Published',
        )
        expect(normalizeInlineEditResponse({ status: 'true' }, 'Draft')).toBe('Draft')
        expect(() =>
            normalizeInlineEditResponse({ status: false, reason: 'Denied' }, 'Draft'),
        ).toThrow(new InlineEditRejectedError('Denied'))
    })

    it('extracts Laravel validation messages and keeps server failures generic', async () => {
        const validation = {
            response: new globalThis.Response(
                JSON.stringify({ errors: { status: ['Status is required.'] }, message: 'Invalid' }),
                { status: 422 },
            ),
        }
        const server = { response: new globalThis.Response('Stack trace', { status: 500 }) }

        await expect(inlineEditErrorMessage(validation, 'Request failed')).resolves.toBe(
            'Status is required.',
        )
        await expect(inlineEditErrorMessage(server, 'Request failed')).resolves.toBe(
            'Request failed',
        )
    })
})
