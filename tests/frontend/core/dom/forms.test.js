import { expect, it, vi } from 'vitest'

import {
    createPostForm,
    submitForm,
    submitPostForm,
} from '../../../../resources/frontend/core/dom/forms.js'

function createNode(tagName) {
    return {
        appendChild: vi.fn(function (child) {
            this.children.push(child)
        }),
        attributes: {},
        children: [],
        requestSubmit: tagName === 'form' ? vi.fn() : undefined,
        setAttribute: vi.fn(function (name, value) {
            this.attributes[name] = value
        }),
        tagName,
    }
}

function createDocument() {
    return {
        body: createNode('body'),
        createElement: vi.fn((tagName) => createNode(tagName)),
    }
}

it('creates a POST form with escaped DOM values instead of HTML concatenation', () => {
    const document = createDocument()
    const form = createPostForm(document, '/users/10', {
        _method: 'DELETE',
        unsafe: '"><script>fixture</script>',
    })

    expect(form.attributes).toEqual({ action: '/users/10', method: 'POST' })
    expect(form.children.map((input) => input.attributes)).toEqual([
        { name: '_method', type: 'hidden', value: 'DELETE' },
        { name: 'unsafe', type: 'hidden', value: '"><script>fixture</script>' },
    ])
})

it('appends and submits a generated form through requestSubmit', () => {
    const document = createDocument()
    const form = submitPostForm(document, '/restore', { _token: 'token' })

    expect(document.body.appendChild).toHaveBeenCalledWith(form)
    expect(form.requestSubmit).toHaveBeenCalledOnce()
})

it('falls back to submit and rejects invalid contracts', () => {
    const form = { submit: vi.fn() }

    submitForm(form)

    expect(form.submit).toHaveBeenCalledOnce()
    expect(() => submitForm({})).toThrow('requires requestSubmit() or submit()')
    expect(() => createPostForm(null, '/users')).toThrow('requires a document')
    expect(() => createPostForm(createDocument(), '', {})).toThrow('non-empty string')
    expect(() => createPostForm(createDocument(), '/users', [])).toThrow('must be an object')
})
