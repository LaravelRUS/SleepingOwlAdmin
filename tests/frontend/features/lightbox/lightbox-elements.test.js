import { expect, it } from 'vitest'

import {
    collectLightboxGallery,
    findLightboxTrigger,
} from '../../../../resources/js/shared/features/lightbox/lightbox-elements.js'

it('collects only the selected gallery in document order', () => {
    const first = trigger('/one.svg', 'catalog', 'One')
    const second = trigger('/two.svg', 'catalog', 'Two')
    const unrelated = trigger('/other.svg', 'other', 'Other')
    const root = queryRoot(first, unrelated, second)

    expect(collectLightboxGallery(root, second)).toEqual({
        elements: [
            { alt: 'One', href: '/one.svg', title: '', type: 'image' },
            { alt: 'Two', href: '/two.svg', title: '', type: 'image' },
        ],
        index: 1,
        triggers: [first, second],
    })
})

it('keeps an ungrouped trigger isolated and resolves nested click targets', () => {
    const selected = trigger('/single.svg', '', 'Single', '<img src=x onerror=alert(1)>')
    const root = queryRoot(selected)
    const nested = { closest: () => selected }

    expect(findLightboxTrigger(root, nested)).toBe(selected)
    expect(collectLightboxGallery(root, selected).elements).toEqual([
        {
            alt: 'Single',
            href: '/single.svg',
            title: '&lt;img src=x onerror=alert(1)&gt;',
            type: 'image',
        },
    ])
})

function queryRoot(...triggers) {
    return {
        contains: (item) => triggers.includes(item),
        querySelectorAll: () => triggers,
    }
}

function trigger(href, gallery, alt, title = '') {
    return {
        dataset: { gallery },
        getAttribute: (name) => ({ href, title })[name] ?? null,
        href,
        querySelector: () => ({ getAttribute: (name) => (name === 'alt' ? alt : null) }),
    }
}
