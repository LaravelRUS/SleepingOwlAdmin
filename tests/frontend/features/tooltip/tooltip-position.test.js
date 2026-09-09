import { expect, it } from 'vitest'

import { tooltipPosition } from '../../../../resources/js/shared/features/tooltip/tooltip-position.js'

it('centers a top tooltip with the configured gap', () => {
    const position = tooltipPosition(rect(40, 40, 20, 10), rect(0, 0, 30, 12), 'top', {
        height: 100,
        width: 100,
    })

    expect(position).toEqual({ placement: 'top', x: 35, y: 20 })
})

it('flips a tooltip that would leave the viewport and clamps its cross axis', () => {
    const position = tooltipPosition(rect(92, 2, 8, 10), rect(0, 0, 30, 12), 'top', {
        height: 100,
        width: 100,
    })

    expect(position).toEqual({ placement: 'bottom', x: 66, y: 20 })
})

function rect(left, top, width, height) {
    return { bottom: top + height, height, left, right: left + width, top, width }
}
