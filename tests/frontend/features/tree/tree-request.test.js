import { expect, it, vi } from 'vitest'

import {
    submitTreeOrder,
    treeRequestParameters,
} from '../../../../resources/frontend/features/tree/tree-request.js'

it('preserves the nested jQuery-compatible tree reorder payload', () => {
    const data = [{ id: '1', children: [{ id: '2' }] }, { id: '3' }]
    const parameters = { locale: 'en', scope: ['catalog', 'visible'] }

    expect([...treeRequestParameters(data, parameters)]).toEqual([
        ['data[0][id]', '1'],
        ['data[0][children][0][id]', '2'],
        ['data[1][id]', '3'],
        ['parameters[locale]', 'en'],
        ['parameters[scope][0]', 'catalog'],
        ['parameters[scope][1]', 'visible'],
    ])
})

it('submits tree order through the shared CSRF-aware HTTP client', async () => {
    const http = { post: vi.fn().mockResolvedValue({ ok: true }) }
    const config = { parameters: { scope: 'catalog' }, url: '/admin/tree/reorder' }
    const data = [{ id: '1' }]

    await submitTreeOrder(http, config, data)

    expect(http.post).toHaveBeenCalledOnce()
    const [url, body, options] = http.post.mock.calls[0]
    expect(url).toBe('/admin/tree/reorder')
    expect(body.toString()).toBe('data%5B0%5D%5Bid%5D=1&parameters%5Bscope%5D=catalog')
    expect(options.headers['Content-Type']).toContain('application/x-www-form-urlencoded')
})
