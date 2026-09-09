import { expect, it } from 'vitest'

import {
    findTooltipTrigger,
    tooltipPlacement,
    tooltipText,
} from '../../../../resources/js/shared/features/tooltip/tooltips.js'

it('resolves a nested target and prefers the native title', () => {
    const trigger = element({ 'data-original-title': 'Legacy', title: 'Native' })
    const nested = { closest: () => trigger }
    const root = { contains: (candidate) => candidate === trigger }

    expect(findTooltipTrigger(root, nested)).toBe(trigger)
    expect(tooltipText(trigger)).toBe('Native')
})

it('supports legacy content and rejects unknown placement values', () => {
    const trigger = element({ 'data-original-title': 'Legacy', 'data-placement': 'diagonal' })

    expect(tooltipText(trigger)).toBe('Legacy')
    expect(tooltipPlacement(trigger)).toBe('top')
})

function element(attributes) {
    return { getAttribute: (name) => attributes[name] ?? null }
}
