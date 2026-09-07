import { expect, it } from 'vitest'

import { readTreeConfig } from '../../../../resources/frontend/features/tree/tree-config.js'

it('reads bounded tree configuration and referenced inert parameters', () => {
    const script = {
        tagName: 'SCRIPT',
        textContent: '{"scope":"catalog"}',
        type: 'application/json',
    }
    const element = {
        dataset: {
            maxDepth: '4',
            reorderable: 'false',
            treeParametersId: 'tree-parameters',
            url: '/admin/tree/reorder',
        },
        nodeType: 1,
        ownerDocument: { getElementById: () => script },
    }

    expect(readTreeConfig(element)).toEqual({
        maxDepth: 4,
        parameters: { scope: 'catalog' },
        reorderable: false,
        url: '/admin/tree/reorder',
    })
})

it('uses a safe max-depth fallback and rejects a missing URL', () => {
    const element = { dataset: { maxDepth: '0', url: '/tree' }, nodeType: 1 }
    expect(readTreeConfig(element).maxDepth).toBe(20)

    expect(() => readTreeConfig({ dataset: {}, nodeType: 1 })).toThrow('Tree requires url')
})
