export const relatedModuleNames = Object.freeze([
    'form.elements.date',
    'form.elements.datetime',
    'form.elements.daterange',
    'form.elements.dependent-select',
    'form.elements.select',
    'form.elements.selectajax',
    'form.elements.wysiwyg',
])

export function initializeRelatedGroup(admin, element) {
    relatedModuleNames.forEach((name) => admin.Modules.call(name))
    admin.Components.scan(element)
}

export function destroyRelatedGroup(admin, element) {
    return admin.Components.destroy(element)
}
