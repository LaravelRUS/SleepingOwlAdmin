import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '../../..')
const themeRoot = resolve(root, 'resources/css/themes')
const sharedSubjects = new Set([
    'soa-app',
    'soa-attachment',
    'soa-attachment-actions',
    'soa-attachment-info',
    'soa-attachment-list',
    'soa-button',
    'soa-button-group',
    'soa-card',
    'soa-card-body',
    'soa-card-footer',
    'soa-card-header',
    'soa-checkbox',
    'soa-choice',
    'soa-dialog',
    'soa-field',
    'soa-file-input',
    'soa-footer',
    'soa-form-actions',
    'soa-header',
    'soa-icon-button',
    'soa-images-dialog',
    'soa-images-grid',
    'soa-input',
    'soa-input-addon',
    'soa-input-group',
    'soa-inline-editable',
    'soa-inline-editor',
    'soa-inline-editor-actions',
    'soa-inline-editor-cancel',
    'soa-inline-editor-check-input',
    'soa-inline-editor-check-option',
    'soa-inline-editor-checklist',
    'soa-inline-editor-clear',
    'soa-inline-editor-clear-all',
    'soa-inline-editor-control',
    'soa-inline-editor-error',
    'soa-inline-editor-form',
    'soa-inline-editor-input',
    'soa-inline-editor-popup',
    'soa-inline-editor-range',
    'soa-inline-editor-range-number',
    'soa-inline-editor-range-number-wrap',
    'soa-inline-editor-range-value',
    'soa-inline-editor-select',
    'soa-inline-editor-submit',
    'soa-inline-editor-title',
    'soa-label',
    'soa-main',
    'soa-scroll-control',
    'soa-select',
    'soa-sidebar',
    'soa-sidebar-overlay',
    'soa-switch',
    'soa-textarea',
    'soa-toolbar',
])
const structuralProperty =
    /^(?:align-|appearance$|block-size$|box-sizing$|cursor$|display$|flex|gap$|grid|height$|inline-size$|inset|justify-|margin|(?:min|max)-|object-fit$|overflow|padding|position$|resize$|transform$|transition|width$|z-index$)/

describe('theme structural boundary', () => {
    it('does not redeclare geometry owned by shared semantic subjects', () => {
        const violations = filesUnder(themeRoot).flatMap(structuralViolations)

        expect(violations).toEqual([])
    })
})

function structuralViolations(file) {
    const source = readFileSync(file, 'utf8')
    const violations = []

    for (const match of source.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
        const [, selector, body] = match
        const properties = [...body.matchAll(/^\s*([a-z-]+)\s*:/gm)]
            .map((property) => property[1])
            .filter((property) => structuralProperty.test(property))

        if (properties.length === 0) continue

        for (const branch of selector.split(',')) {
            const subject = branch
                .trim()
                .split(/[\s>+~]+/)
                .at(-1)
            const classes = [...subject.matchAll(/\.([a-z][a-z0-9-]*)/g)].map(
                (classMatch) => classMatch[1],
            )
            const sharedClass = classes.find((className) => sharedSubjects.has(className))

            if (sharedClass) {
                violations.push(
                    `${file.slice(root.length + 1)}: .${sharedClass} -> ${properties.join(', ')}`,
                )
            }
        }
    }

    return violations
}

function filesUnder(directory) {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const path = resolve(directory, entry.name)

        if (entry.isDirectory()) return filesUnder(path)

        return entry.isFile() && entry.name.endsWith('.scss') ? [path] : []
    })
}
