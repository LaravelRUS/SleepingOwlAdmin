import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

import { expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')
const sharedPartial = 'resources/css/shared/features/table/_pagination.scss'
const pageJumpPartial = 'resources/css/shared/features/table/_page-jump.scss'
const processingPartial = 'resources/css/shared/features/table/_processing.scss'
const searchPartial = 'resources/css/shared/features/table/_search.scss'
const columnOrderPartial = 'resources/css/shared/features/table/_column-order.scss'

it('keeps pagination and page-jump presentation in shared source owners', () => {
    const source = read(sharedPartial)
    const pageJumpSource = read(pageJumpPartial)
    const processingSource = read(processingPartial)
    const searchSource = read(searchPartial)
    const columnOrderSource = read(columnOrderPartial)
    const tableEntry = read('resources/css/shared/features/table/table.scss')

    for (const selector of [
        '.soa-pagination',
        '.dt-paging nav',
        '.dt-paging-button',
        '.page-item .page-link',
    ]) {
        expect(source).toContain(selector)
    }

    expect(source).toContain(':is(a, button).dt-paging-button')
    expect(source).not.toMatch(/\.dt-paging\s+\.dt-paging-button(?:\s|,|\{)/)

    expect(tableEntry).toContain("@use 'pagination';")
    expect(tableEntry).toContain('@include pagination.styles;')
    expect(pageJumpSource).toContain('.soa-dt-page-jump')
    expect(pageJumpSource).toContain('.soa-dt-page-jump-input')
    expect(tableEntry).toContain("@use 'page-jump';")
    expect(tableEntry).toContain('@include page-jump.styles;')
    expect(processingSource).toContain('div.dt-processing')
    expect(processingSource).toContain('datatables-loader-1')
    expect(processingSource).toContain('datatables-loader-2')
    expect(processingSource).toContain('datatables-loader-3')
    expect(tableEntry).toContain("@use 'processing';")
    expect(tableEntry).toContain('@include processing.styles;')
    expect(searchSource).toContain('.dt-container .dt-search')
    expect(searchSource).toContain('var(--soa-table-search-gap)')
    expect(tableEntry).toContain("@use 'search';")
    expect(tableEntry).toContain('@include search.styles;')
    expect(columnOrderSource).toContain('.dt-column-order')
    expect(columnOrderSource).toContain("[aria-sort='ascending']")
    expect(columnOrderSource).toContain('.dt-column-header > .dt-column-order::before')
    expect(columnOrderSource).toContain('border-block-end')
    expect(columnOrderSource).toContain('.dt-orderable-none .dt-column-header > .dt-column-order')
    expect(tableEntry).toContain("@use 'column-order';")
    expect(tableEntry).toContain('@include column-order.styles;')
})

it('keeps pagination selectors out of theme presentation sources', () => {
    const themeSources = filesUnder(resolve(root, 'resources/css/themes'))
        .map((path) => readFileSync(path, 'utf8'))
        .join('\n')

    expect(themeSources).not.toMatch(/\.soa-pagination\b/)
    expect(themeSources).not.toMatch(/\.dt-paging(?:\b|[-.])/)
    expect(themeSources).not.toMatch(/\.page-item\s+\.page-link/)
    expect(themeSources).not.toMatch(/\.soa-dt-page-jump\b/)
    expect(themeSources).not.toMatch(/\.dt-processing\b/)
    expect(themeSources).not.toMatch(/\.dt-search\b/)
    expect(themeSources).not.toMatch(/\.dt-column-order\b/)
})

it('publishes shared pagination in modern and legacy feature bundles', () => {
    for (const output of [
        'public/default/css/shared/features.css',
        'public/default/css/admin-app.css',
    ]) {
        const css = read(output)

        expect(css).toContain('.soa-pagination')
        expect(css).toContain('.dt-paging-button')
        expect(css).toContain('.soa-dt-page-jump')
        expect(css).toContain('.dt-processing')
        expect(css).toContain('div.dt-processing > div:last-child')
        expect(css).toContain('datatables-loader-1')
        expect(css).toContain('.dt-container .dt-search')
        expect(css).toContain('var(--soa-table-search-gap)')
        expect(css).toContain('.dt-column-order')
        expect(css).toContain('var(--soa-table-column-order-gap)')
        expect(css).toContain('var(--soa-on-primary-color)')
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
