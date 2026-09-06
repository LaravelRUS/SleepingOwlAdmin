const NEW_PRIMARY = /^new_(\d+)$/
const NEW_PRIMARY_PREFIX = 'new_'

export function normalizeRelatedGroups(groups) {
    if (!Array.isArray(groups)) throw new TypeError('Related groups must be an array.')

    return groups.map((group, position) => normalizeGroup(group, position))
}

export function normalizeRemovedGroups(groups) {
    if (!Array.isArray(groups)) throw new TypeError('Removed related groups must be an array.')

    return [...new Set(groups.map(String))]
}

export function firstNewGroupIndex(groups) {
    const usedIndexes = groups.map(({ primary }) => newPrimaryIndex(primary)).filter(Number.isInteger)
    const usedFloor = usedIndexes.length === 0 ? 1 : Math.max(...usedIndexes) + 1

    return Math.max(groups.length + 1, usedFloor)
}

export function canAddRelatedGroup(limit, groupCount) {
    return limit === null || limit === undefined || limit > groupCount
}

export function isPersistedPrimary(primary) {
    const value = String(primary ?? '')

    return value.length > 0 && !value.startsWith(NEW_PRIMARY_PREFIX)
}

function normalizeGroup(group, position) {
    if (!group || typeof group !== 'object' || Array.isArray(group)) {
        throw new TypeError('Each related group must be an object.')
    }
    if (typeof group.html !== 'string') {
        throw new TypeError('Each related group must contain HTML.')
    }

    const primary = String(group.primary ?? '')

    return Object.freeze({
        html: group.html,
        index: String(group.index ?? position),
        key: `initial:${position}:${primary}`,
        primary,
    })
}

function newPrimaryIndex(primary) {
    const match = String(primary ?? '').match(NEW_PRIMARY)

    return match ? Number(match[1]) : null
}
