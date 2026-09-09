import { installTrees } from './install-trees.js'

if (globalThis.document) bootTrees(globalThis)

export function bootTrees(target) {
    const trees = installTrees(target.Admin, {
        labels: treeLabels(target.trans),
        root: target.document,
    })
    target.Admin.Trees = trees
    trees.scan()

    return trees
}

function treeLabels(translate) {
    return {
        collapse: translated(translate, 'lang.tree.collapse', 'Collapse'),
        expand: translated(translate, 'lang.tree.expand', 'Expand'),
    }
}

function translated(translate, key, fallback) {
    if (typeof translate !== 'function') return fallback

    const value = translate(key)

    return typeof value === 'string' && value !== key ? value : fallback
}
