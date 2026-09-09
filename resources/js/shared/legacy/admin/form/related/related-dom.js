import { parseJsonProps } from '../../../../../core/data/island-props'
import {
    appendRelatedIndex,
    createRelatedName,
    rewriteRelatedIslandProps,
} from './related-fields'

const CONTROL_SELECTOR = 'input, select, textarea'
const ISLAND_SELECTOR = '[data-vue-app][data-vue-component]'

export function createRelatedGroup(document, html, context) {
    const group = parseGroup(document, html)
    markGroup(group, context)
    rewriteControls(group, context)
    rewriteIslands(group, context)

    return group
}

function parseGroup(document, html) {
    const template = document.createElement('template')
    template.innerHTML = html.trim()
    if (template.content.children.length !== 1) {
        throw new Error('Related group HTML must contain exactly one root element.')
    }

    return template.content.firstElementChild
}

function markGroup(group, context) {
    group.dataset.relatedGroup = ''
    group.dataset.relatedIndex = String(context.index)
    group.dataset.relatedKey = context.key
    group.dataset.relatedPrimary = context.primary
}

function rewriteControls(group, context) {
    group.querySelectorAll(CONTROL_SELECTOR).forEach((control) => {
        rewriteId(control, context.index)
        if (context.isNew) rewriteName(control, context)
    })
}

function rewriteId(element, index) {
    const value = element.getAttribute('id')
    if (!value) return

    element.setAttribute('id', appendRelatedIndex(value, index))
}

function rewriteName(element, context) {
    const value = element.getAttribute('name')
    if (!value) return

    element.setAttribute('name', createRelatedName(context.name, context.index, value))
}

function rewriteIslands(group, context) {
    group.querySelectorAll(ISLAND_SELECTOR).forEach((host, position) => {
        const binding = islandPropsBinding(group, host, context, position)
        const props = rewriteRelatedIslandProps(parseJsonProps(binding.source), context)
        binding.write(JSON.stringify(props))
    })
}

function islandPropsBinding(group, host, context, position) {
    const id = host.dataset.vuePropsId
    if (!id) return inlinePropsBinding(host)

    const script = findPropsScript(group, id)
    if (!script) throw new Error(`Related island props script [${id}] was not found.`)
    if (context.isNew) assignUniquePropsId(host, script, context.key, position)

    return scriptPropsBinding(script)
}

function inlinePropsBinding(host) {
    return {
        source: host.dataset.vueProps || '{}',
        write: (source) => {
            host.dataset.vueProps = source
        },
    }
}

function scriptPropsBinding(script) {
    return {
        source: script.textContent || '{}',
        write: (source) => {
            script.textContent = source
        },
    }
}

function findPropsScript(group, id) {
    return [...group.querySelectorAll('script[type="application/json"][id]')].find(
        (script) => script.id === id,
    )
}

function assignUniquePropsId(host, script, key, position) {
    const suffix = `${safeIdPart(key)}-${position}`
    script.id = `${script.id}--${suffix}`
    host.dataset.vuePropsId = script.id
}

function safeIdPart(value) {
    return String(value).replace(/[^a-zA-Z0-9_-]/g, '-')
}
