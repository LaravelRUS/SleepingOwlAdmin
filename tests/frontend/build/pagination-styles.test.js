import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

import { expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')
const sharedPartial = 'resources/css/shared/features/table/_pagination.scss'
const pageJumpPartial = 'resources/css/shared/features/table/_page-jump.scss'
const processingPartial = 'resources/css/shared/features/table/_processing.scss'
const searchPartial = 'resources/css/shared/features/table/_search.scss'
const columnOrderPartial = 'resources/css/shared/features/table/_column-order.scss'
const sourceExpectations = {
    [sharedPartial]: [
        '.soa-pagination',
        '.dt-paging nav',
        '.dt-paging-button',
        '.page-item .page-link',
        ':is(a, button).dt-paging-button',
    ],
    [pageJumpPartial]: ['.soa-dt-page-jump', '.soa-dt-page-jump-input'],
    [processingPartial]: [
        'div.dt-processing',
        'datatables-loader-1',
        'datatables-loader-2',
        'datatables-loader-3',
    ],
    [searchPartial]: ['.dt-container .dt-search', 'var(--soa-table-search-gap)'],
    [columnOrderPartial]: [
        '.dt-column-order',
        '--dt-order-arrow-width',
        '.dt-ordering-asc .dt-column-order::before',
        'border-bottom',
        '.dt-orderable-none:not(.dt-ordering-asc, .dt-ordering-desc)',
    ],
    'resources/css/shared/features/table/table.scss': [
        "@use 'pagination';",
        '@include pagination.styles;',
        "@use 'page-jump';",
        '@include page-jump.styles;',
        "@use 'processing';",
        '@include processing.styles;',
        "@use 'search';",
        '@include search.styles;',
        "@use 'column-order';",
        '@include column-order.styles;',
    ],
}

it('keeps pagination and page-jump presentation in shared source owners', () => {
    const source = read(sharedPartial)

    for (const [path, snippets] of Object.entries(sourceExpectations)) {
        expectSourceToContain(read(path), snippets)
    }

    expect(source).not.toMatch(/\.dt-paging\s+\.dt-paging-button(?:\s|,|\{)/)
})

it('keeps pagination selectors out of theme presentation sources', () => {
    const themeSources = filesUnder(resolve(root, 'resources/css/themes'))
        .map((path) => readFileSync(path, 'utf8'))
        .join('\n')

    for (const selector of [
        /\.soa-pagination\b/,
        /\.dt-paging(?:\b|[-.])/,
        /\.page-item\s+\.page-link/,
        /\.soa-dt-page-jump\b/,
        /\.dt-processing\b/,
        /\.dt-search\b/,
        /\.dt-column-order\b/,
    ]) {
        expect(themeSources).not.toMatch(selector)
    }
})

it('publishes shared pagination in modern and legacy feature bundles', () => {
    for (const output of [
        'public/default/css/shared/features.css',
        'public/default/css/admin-app.css',
    ]) {
        const css = read(output)

        expectSourceToContain(css, [
            '.soa-pagination',
            '.dt-paging-button',
            '.soa-dt-page-jump',
            '.dt-processing',
            'datatables-loader-1',
            '.dt-container .dt-search',
            'var(--soa-table-search-gap)',
            '.dt-column-order',
            'var(--dt-order-arrow-width)',
            'var(--soa-on-primary-color)',
        ])
        expect(css).toMatch(/div\.dt-processing\s*>\s*div:last-child/)
    }
})

function filesUnder(directory) {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const path = resolve(directory, entry.name)

        if (entry.isDirectory()) return filesUnder(path)

        return entry.isFile() && entry.name.endsWith('.scss') ? [path] : []
    })
}

function read(path) {
    return readFileSync(resolve(root, path), 'utf8')
}

function expectSourceToContain(source, snippets) {
    for (const snippet of snippets) {
        expect(source).toContain(snippet)
    }
}
