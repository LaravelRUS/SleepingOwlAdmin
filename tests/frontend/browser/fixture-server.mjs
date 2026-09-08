import { createReadStream } from 'node:fs'
import { createServer } from 'node:http'
import { dirname, join } from 'node:path'
import { fileURLToPath, URL, URLSearchParams } from 'node:url'

const browserDirectory = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(browserDirectory, '..', '..', '..')
const origin = 'http://127.0.0.1:4173'
const staticRoutes = new Map([
    ['/', [join(browserDirectory, 'island-props.html'), 'text/html; charset=utf-8']],
    ['/admin-core', [join(browserDirectory, 'admin-core.html'), 'text/html; charset=utf-8']],
    [
        '/adminlte-logical-runtime',
        [join(browserDirectory, 'adminlte-logical-runtime.html'), 'text/html; charset=utf-8'],
    ],
    [
        '/theme-capabilities-adminlte',
        [join(browserDirectory, 'theme-capabilities-adminlte.html'), 'text/html; charset=utf-8'],
    ],
    [
        '/theme-capabilities-framework-free',
        [
            join(browserDirectory, 'theme-capabilities-framework-free.html'),
            'text/html; charset=utf-8',
        ],
    ],
    [
        '/theme-capabilities-tailwind',
        [join(browserDirectory, 'theme-capabilities-tailwind.html'), 'text/html; charset=utf-8'],
    ],
    [
        '/compatibility-runtime',
        [join(browserDirectory, 'compatibility-runtime.html'), 'text/html; charset=utf-8'],
    ],
    [
        '/application-blade-overrides',
        [join(browserDirectory, 'application-blade-overrides.html'), 'text/html; charset=utf-8'],
    ],
    ['/alerts', [join(browserDirectory, 'alerts.html'), 'text/html; charset=utf-8']],
    ['/alerts-modern', [join(browserDirectory, 'alerts-modern.html'), 'text/html; charset=utf-8']],
    [
        '/island-props-csp',
        [join(browserDirectory, 'island-props-csp.html'), 'text/html; charset=utf-8'],
    ],
    ['/dom-listeners', [join(browserDirectory, 'dom-listeners.html'), 'text/html; charset=utf-8']],
    [
        '/legacy-datatables',
        [join(browserDirectory, 'legacy-datatables.html'), 'text/html; charset=utf-8'],
    ],
    ['/legacy-vue', [join(browserDirectory, 'legacy-vue.html'), 'text/html; charset=utf-8']],
    ['/files', [join(browserDirectory, 'files.html'), 'text/html; charset=utf-8']],
    ['/forms-logical', [join(browserDirectory, 'forms-logical.html'), 'text/html; charset=utf-8']],
    ['/table-logical', [join(browserDirectory, 'table-logical.html'), 'text/html; charset=utf-8']],
    ['/wysiwyg', [join(browserDirectory, 'wysiwyg.html'), 'text/html; charset=utf-8']],
    [
        '/custom-vue-island',
        [join(browserDirectory, 'custom-vue-island.html'), 'text/html; charset=utf-8'],
    ],
    [
        '/native-controls',
        [join(browserDirectory, 'native-controls.html'), 'text/html; charset=utf-8'],
    ],
    ['/runtime-theme', [join(browserDirectory, 'runtime-theme.html'), 'text/html; charset=utf-8']],
    [
        '/table-presentation',
        [join(browserDirectory, 'table-presentation.html'), 'text/html; charset=utf-8'],
    ],
    [
        '/select-controls',
        [join(browserDirectory, 'select-controls.html'), 'text/html; charset=utf-8'],
    ],
    [
        '/dependent-controls',
        [join(browserDirectory, 'dependent-controls.html'), 'text/html; charset=utf-8'],
    ],
    ['/dropdowns', [join(browserDirectory, 'dropdowns.html'), 'text/html; charset=utf-8']],
    ['/sidebars', [join(browserDirectory, 'sidebars.html'), 'text/html; charset=utf-8']],
    [
        '/sidebars-modern',
        [join(browserDirectory, 'sidebars-modern.html'), 'text/html; charset=utf-8'],
    ],
    [
        '/sidebar-presentation',
        [join(browserDirectory, 'sidebar-presentation.html'), 'text/html; charset=utf-8'],
    ],
    [
        '/dropdowns-modern',
        [join(browserDirectory, 'dropdowns-modern.html'), 'text/html; charset=utf-8'],
    ],
    [
        '/dropdown-presentation',
        [join(browserDirectory, 'dropdown-presentation.html'), 'text/html; charset=utf-8'],
    ],
    [
        '/inline-editors',
        [join(browserDirectory, 'inline-editors.html'), 'text/html; charset=utf-8'],
    ],
    ['/lightboxes', [join(browserDirectory, 'lightboxes.html'), 'text/html; charset=utf-8']],
    [
        '/lightbox-presentation',
        [join(browserDirectory, 'lightbox-presentation.html'), 'text/html; charset=utf-8'],
    ],
    ['/tabs', [join(browserDirectory, 'tabs.html'), 'text/html; charset=utf-8']],
    ['/tabs-modern', [join(browserDirectory, 'tabs-modern.html'), 'text/html; charset=utf-8']],
    [
        '/tabs-presentation',
        [join(browserDirectory, 'tabs-presentation.html'), 'text/html; charset=utf-8'],
    ],
    ['/tooltips', [join(browserDirectory, 'tooltips.html'), 'text/html; charset=utf-8']],
    [
        '/tooltip-presentation',
        [join(browserDirectory, 'tooltip-presentation.html'), 'text/html; charset=utf-8'],
    ],
    ['/trees', [join(browserDirectory, 'trees.html'), 'text/html; charset=utf-8']],
    [
        '/tree-notifications',
        [join(browserDirectory, 'tree-notifications.html'), 'text/html; charset=utf-8'],
    ],
    [
        '/tree-presentation',
        [join(browserDirectory, 'tree-presentation.html'), 'text/html; charset=utf-8'],
    ],
    ['/date-controls', [join(browserDirectory, 'date-controls.html'), 'text/html; charset=utf-8']],
    [
        '/resources/frontend/core/data/island-props.js',
        [
            join(projectRoot, 'resources', 'frontend', 'core', 'data', 'island-props.js'),
            'text/javascript',
        ],
    ],
    [
        '/resources/frontend/core/dom/listeners.js',
        [
            join(projectRoot, 'resources', 'frontend', 'core', 'dom', 'listeners.js'),
            'text/javascript',
        ],
    ],
    [
        '/public/default/js/admin-core.js',
        [join(projectRoot, 'public', 'default', 'js', 'admin-core.js'), 'text/javascript'],
    ],
    [
        '/public/default/css/admin-core.css',
        [join(projectRoot, 'public', 'default', 'css', 'admin-core.css'), 'text/css'],
    ],
    [
        '/public/default/js/features/alert.js',
        [join(projectRoot, 'public', 'default', 'js', 'features', 'alert.js'), 'text/javascript'],
    ],
    [
        '/public/default/js/features/tabs.js',
        [join(projectRoot, 'public', 'default', 'js', 'features', 'tabs.js'), 'text/javascript'],
    ],
    [
        '/public/default/js/features/dropdown.js',
        [
            join(projectRoot, 'public', 'default', 'js', 'features', 'dropdown.js'),
            'text/javascript',
        ],
    ],
    [
        '/public/default/js/features/sidebar.js',
        [join(projectRoot, 'public', 'default', 'js', 'features', 'sidebar.js'), 'text/javascript'],
    ],
    [
        '/public/default/js/features/lightbox.js',
        [
            join(projectRoot, 'public', 'default', 'js', 'features', 'lightbox.js'),
            'text/javascript',
        ],
    ],
    [
        '/public/default/js/features/tree.js',
        [join(projectRoot, 'public', 'default', 'js', 'features', 'tree.js'), 'text/javascript'],
    ],
    [
        '/public/default/js/features/tooltip.js',
        [join(projectRoot, 'public', 'default', 'js', 'features', 'tooltip.js'), 'text/javascript'],
    ],
    [
        '/public/default/js/admin-app.js',
        [join(projectRoot, 'public', 'default', 'js', 'admin-app.js'), 'text/javascript'],
    ],
    [
        '/public/default/js/admin-app-dev.js',
        [join(projectRoot, 'public', 'default', 'js', 'admin-app-dev.js'), 'text/javascript'],
    ],
    [
        '/public/default/js/modules.js',
        [join(projectRoot, 'public', 'default', 'js', 'modules.js'), 'text/javascript'],
    ],
    [
        '/public/default/js/vue.js',
        [join(projectRoot, 'public', 'default', 'js', 'vue.js'), 'text/javascript'],
    ],
    [
        '/public/default/js/vue-dev.js',
        [join(projectRoot, 'public', 'default', 'js', 'vue-dev.js'), 'text/javascript'],
    ],
    [
        '/public/default/profiles/development/js/shared/vue.js',
        [
            join(
                projectRoot,
                'public',
                'default',
                'profiles',
                'development',
                'js',
                'shared',
                'vue.js',
            ),
            'text/javascript',
        ],
    ],
    [
        '/public/default/profiles/development/js/shared/compatibility.js',
        [
            join(
                projectRoot,
                'public',
                'default',
                'profiles',
                'development',
                'js',
                'shared',
                'compatibility.js',
            ),
            'text/javascript',
        ],
    ],
    ...profileFeatureRoutes('development', ['forms', 'lightbox', 'table', 'tooltip', 'tree']),
    ...profileFeatureRoutes('development', ['alert', 'dropdown', 'sidebar', 'tabs']),
    ...profileThemeAdapterRoutes('development', [
        ['tree', 'legacy-adminlte'],
        ['tree', 'tailwind'],
    ]),
    ...profileThemeRoutes('development', ['legacy-adminlte', 'tailwind']),
    ...profileSharedRoutes('development', ['modules']),
    ...profileStyleRoutes('development', themeCapabilityStyles()),
    [
        '/public/default/profiles/production/js/shared/vue.js',
        [
            join(
                projectRoot,
                'public',
                'default',
                'profiles',
                'production',
                'js',
                'shared',
                'vue.js',
            ),
            'text/javascript',
        ],
    ],
    [
        '/public/default/profiles/production/js/shared/compatibility.js',
        [
            join(
                projectRoot,
                'public',
                'default',
                'profiles',
                'production',
                'js',
                'shared',
                'compatibility.js',
            ),
            'text/javascript',
        ],
    ],
    ...profileFeatureRoutes('production', ['forms', 'lightbox', 'table', 'tooltip', 'tree']),
    ...profileFeatureRoutes('production', ['alert', 'dropdown', 'sidebar', 'tabs']),
    ...profileThemeAdapterRoutes('production', [
        ['tree', 'legacy-adminlte'],
        ['tree', 'tailwind'],
    ]),
    ...profileThemeRoutes('production', ['legacy-adminlte', 'tailwind']),
    ...profileSharedRoutes('production', ['modules']),
    ...profileStyleRoutes('production', themeCapabilityStyles()),
    [
        '/public/default/css/admin-app.css',
        [join(projectRoot, 'public', 'default', 'css', 'admin-app.css'), 'text/css'],
    ],
    [
        '/public/default/css/features/dropdown.css',
        [join(projectRoot, 'public', 'default', 'css', 'features', 'dropdown.css'), 'text/css'],
    ],
    [
        '/public/default/css/features/dropdown/themes/legacy-adminlte.css',
        [
            join(
                projectRoot,
                'public',
                'default',
                'css',
                'features',
                'dropdown',
                'themes',
                'legacy-adminlte.css',
            ),
            'text/css',
        ],
    ],
    [
        '/public/default/css/features/dropdown/themes/tailwind.css',
        [
            join(
                projectRoot,
                'public',
                'default',
                'css',
                'features',
                'dropdown',
                'themes',
                'tailwind.css',
            ),
            'text/css',
        ],
    ],
    [
        '/public/default/css/features/sidebar.css',
        [join(projectRoot, 'public', 'default', 'css', 'features', 'sidebar.css'), 'text/css'],
    ],
    [
        '/public/default/css/features/sidebar/themes/legacy-adminlte.css',
        [
            join(
                projectRoot,
                'public',
                'default',
                'css',
                'features',
                'sidebar',
                'themes',
                'legacy-adminlte.css',
            ),
            'text/css',
        ],
    ],
    [
        '/public/default/css/features/sidebar/themes/tailwind.css',
        [
            join(
                projectRoot,
                'public',
                'default',
                'css',
                'features',
                'sidebar',
                'themes',
                'tailwind.css',
            ),
            'text/css',
        ],
    ],
    [
        '/public/default/css/features/tooltip.css',
        [join(projectRoot, 'public', 'default', 'css', 'features', 'tooltip.css'), 'text/css'],
    ],
    [
        '/public/default/css/features/tooltip/themes/legacy-adminlte.css',
        [
            join(
                projectRoot,
                'public',
                'default',
                'css',
                'features',
                'tooltip',
                'themes',
                'legacy-adminlte.css',
            ),
            'text/css',
        ],
    ],
    [
        '/public/default/css/features/tooltip/themes/tailwind.css',
        [
            join(
                projectRoot,
                'public',
                'default',
                'css',
                'features',
                'tooltip',
                'themes',
                'tailwind.css',
            ),
            'text/css',
        ],
    ],
    [
        '/public/default/css/themes/legacy-adminlte.css',
        [
            join(projectRoot, 'public', 'default', 'css', 'themes', 'legacy-adminlte.css'),
            'text/css',
        ],
    ],
    [
        '/public/default/css/themes/tailwind.css',
        [join(projectRoot, 'public', 'default', 'css', 'themes', 'tailwind.css'), 'text/css'],
    ],
    [
        '/public/default/css/features/table.css',
        [join(projectRoot, 'public', 'default', 'css', 'features', 'table.css'), 'text/css'],
    ],
    [
        '/public/default/css/features/lightbox.css',
        [join(projectRoot, 'public', 'default', 'css', 'features', 'lightbox.css'), 'text/css'],
    ],
    [
        '/public/default/css/features/lightbox/themes/legacy-adminlte.css',
        [
            join(
                projectRoot,
                'public',
                'default',
                'css',
                'features',
                'lightbox',
                'themes',
                'legacy-adminlte.css',
            ),
            'text/css',
        ],
    ],
    [
        '/public/default/css/features/lightbox/themes/tailwind.css',
        [
            join(
                projectRoot,
                'public',
                'default',
                'css',
                'features',
                'lightbox',
                'themes',
                'tailwind.css',
            ),
            'text/css',
        ],
    ],
    [
        '/public/default/css/features/tabs/themes/legacy-adminlte.css',
        [
            join(
                projectRoot,
                'public',
                'default',
                'css',
                'features',
                'tabs',
                'themes',
                'legacy-adminlte.css',
            ),
            'text/css',
        ],
    ],
    [
        '/public/default/css/features/tabs/themes/tailwind.css',
        [
            join(
                projectRoot,
                'public',
                'default',
                'css',
                'features',
                'tabs',
                'themes',
                'tailwind.css',
            ),
            'text/css',
        ],
    ],
    [
        '/public/default/css/features/table/themes/datatables-legacy-adminlte.css',
        [
            join(
                projectRoot,
                'public',
                'default',
                'css',
                'features',
                'table',
                'themes',
                'datatables-legacy-adminlte.css',
            ),
            'text/css',
        ],
    ],
    [
        '/public/default/css/features/table/themes/tailwind.css',
        [
            join(
                projectRoot,
                'public',
                'default',
                'css',
                'features',
                'table',
                'themes',
                'tailwind.css',
            ),
            'text/css',
        ],
    ],
    [
        '/public/default/css/features/tree.css',
        [join(projectRoot, 'public', 'default', 'css', 'features', 'tree.css'), 'text/css'],
    ],
    [
        '/public/default/css/features/tree/themes/legacy-adminlte.css',
        [
            join(
                projectRoot,
                'public',
                'default',
                'css',
                'features',
                'tree',
                'themes',
                'legacy-adminlte.css',
            ),
            'text/css',
        ],
    ],
    [
        '/public/default/css/features/tree/themes/tailwind.css',
        [
            join(
                projectRoot,
                'public',
                'default',
                'css',
                'features',
                'tree',
                'themes',
                'tailwind.css',
            ),
            'text/css',
        ],
    ],
    [
        '/fixtures/custom-vue-island.js',
        [join(browserDirectory, 'custom-vue-island.js'), 'text/javascript; charset=utf-8'],
    ],
])

function profileFeatureRoutes(profile, features) {
    const profileRoot = join(projectRoot, 'public', 'default', 'profiles', profile, 'js')
    const core = [
        `/public/default/profiles/${profile}/js/admin-core.js`,
        [join(profileRoot, 'admin-core.js'), 'text/javascript'],
    ]
    const entries = features.map((feature) => [
        `/public/default/profiles/${profile}/js/features/${feature}.js`,
        [join(profileRoot, 'features', `${feature}.js`), 'text/javascript'],
    ])

    return [core, ...entries]
}

function profileThemeAdapterRoutes(profile, adapters) {
    const profileRoot = join(projectRoot, 'public', 'default', 'profiles', profile, 'js')

    return adapters.map(([feature, theme]) => [
        `/public/default/profiles/${profile}/js/features/${feature}/themes/${theme}.js`,
        [join(profileRoot, 'features', feature, 'themes', `${theme}.js`), 'text/javascript'],
    ])
}

function profileThemeRoutes(profile, themes) {
    const profileRoot = join(projectRoot, 'public', 'default', 'profiles', profile, 'js')

    return themes.map((theme) => [
        `/public/default/profiles/${profile}/js/themes/${theme}.js`,
        [join(profileRoot, 'themes', `${theme}.js`), 'text/javascript'],
    ])
}

function profileSharedRoutes(profile, entries) {
    const profileRoot = join(projectRoot, 'public', 'default', 'profiles', profile, 'js')

    return entries.map((entry) => [
        `/public/default/profiles/${profile}/js/shared/${entry}.js`,
        [join(profileRoot, 'shared', `${entry}.js`), 'text/javascript'],
    ])
}

function profileStyleRoutes(profile, entries) {
    const profileRoot = join(projectRoot, 'public', 'default', 'profiles', profile, 'css')

    return entries.map((entry) => [
        `/public/default/profiles/${profile}/css/${entry}`,
        [join(profileRoot, ...entry.split('/')), 'text/css'],
    ])
}

function tailwindCapabilityStyles() {
    return [
        'themes/tailwind.css',
        'themes/tailwind-utilities.css',
        'features/dropdown/themes/tailwind.css',
        'features/forms/themes/tailwind.css',
        'features/lightbox/themes/tailwind.css',
        'features/sidebar/themes/tailwind.css',
        'features/table/themes/tailwind.css',
        'features/tabs/themes/tailwind.css',
        'features/tooltip/themes/tailwind.css',
        'features/tree/themes/tailwind.css',
    ]
}

function themeCapabilityStyles() {
    const base = [
        'admin-core.css',
        'icons.css',
        'features/dropdown.css',
        'features/forms.css',
        'features/lightbox.css',
        'features/sidebar.css',
        'features/table.css',
        'features/tooltip.css',
        'features/tree.css',
    ]
    const legacy = [
        'themes/legacy-adminlte.css',
        'features/dropdown/themes/legacy-adminlte.css',
        'features/lightbox/themes/legacy-adminlte.css',
        'features/sidebar/themes/legacy-adminlte.css',
        'features/table/themes/datatables-legacy-adminlte.css',
        'features/tabs/themes/legacy-adminlte.css',
        'features/tooltip/themes/legacy-adminlte.css',
        'features/tree/themes/legacy-adminlte.css',
    ]
    const frameworkFree = [
        'themes/framework-free-test.css',
        'features/dropdown/themes/framework-free-test.css',
        'features/sidebar/themes/framework-free-test.css',
        'features/table/themes/framework-free-test.css',
        'features/tabs/themes/framework-free-test.css',
        'features/tooltip/themes/framework-free-test.css',
    ]
    return [...base, ...legacy, ...frameworkFree, ...tailwindCapabilityStyles()]
}

const fixtureRequests = new Map()
const fixtureInlineValues = new Map()
const defaultFixtureScope = 'default'

function fixtureScope(request) {
    return request.headers['x-fixture-scope'] || defaultFixtureScope
}

function scopedRequests(request) {
    const scope = fixtureScope(request)

    if (!fixtureRequests.has(scope)) {
        fixtureRequests.set(scope, [])
    }

    return fixtureRequests.get(scope)
}

function scopedInlineValues(request) {
    const scope = fixtureScope(request)

    if (!fixtureInlineValues.has(scope)) {
        fixtureInlineValues.set(scope, new Map())
    }

    return fixtureInlineValues.get(scope)
}

function sendJson(response, value) {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(value))
}

function serveFile(response, route) {
    const [path, contentType] = route
    response.writeHead(200, { 'Content-Type': contentType })
    createReadStream(path).pipe(response)
}

async function readBody(request) {
    request.setEncoding('utf8')
    let body = ''

    for await (const chunk of request) {
        body += chunk
    }

    return body
}

async function readParameters(request, url) {
    if (request.method === 'GET') {
        return Object.fromEntries(url.searchParams)
    }

    return Object.fromEntries(new URLSearchParams(await readBody(request)))
}

function recordRequest(kind, request, parameters) {
    scopedRequests(request).push({
        kind,
        method: request.method,
        parameters,
        url: request.url,
    })
}

function editableCell(id, values) {
    const templateId = `inline-edit-template-${id}`
    const value = values.get(String(id)) ?? 'Draft'

    return `<button type="button" class="soa-inline-editable" id="inline-edit-${id}" data-inline-editor="text" data-name="status" data-value="${value}" data-url="/api/inline-edit" data-pk="${id}" data-mode="inline" data-empty-text="empty" data-inline-editor-template-id="${templateId}" aria-expanded="false">${value}</button>${inlineEditorTemplate(templateId)}`
}

function inlineEditorTemplate(id) {
    return `<template id="${id}" data-inline-editor-template="text"><div class="soa-inline-editor soa-inline-editor-inline" data-inline-editor-root role="group"><form class="soa-inline-editor-form" data-inline-editor-form><div class="soa-inline-editor-input"><input class="soa-inline-editor-control" data-inline-editor-control type="text"></div><div class="soa-inline-editor-actions"><button class="soa-inline-editor-submit" type="submit">Save</button><button class="soa-inline-editor-cancel" data-inline-editor-cancel type="button">Cancel</button></div><div class="soa-inline-editor-error" data-inline-editor-error role="alert" hidden></div></form></div></template>`
}

function fixtureRow(id, values) {
    return [
        `<input type="checkbox" class="adminCheckboxRow" name="_id[]" value="${id}">`,
        editableCell(id, values),
        `2026-09-0${id}`,
        String(id * 10),
        id % 2 === 0 ? 'archived' : 'active',
        '2026-09-01 - 2026-09-06',
        `<span id="draw-tooltip-${id}" data-toggle="tooltip" title="row ${id}">row ${id}</span><img id="lazy-image-${id}" class="lazyload" data-src="/fixtures/pixel.svg" alt="">`,
        { add_class: 'fixture-row' },
    ]
}

function tableRows(parameters, values) {
    const ids = [1, 2, 3, 4, 5, 6]
    const start = Number(parameters.start || 0)
    const length = Number(parameters.length || 2)
    const visible = length === -1 ? ids.slice(start) : ids.slice(start, start + length)

    return visible.map((id) => fixtureRow(id, values))
}

async function handleTable(request, response, url) {
    const parameters = await readParameters(request, url)
    recordRequest('datatable', request, parameters)
    sendJson(response, {
        draw: Number(parameters.draw || 0),
        recordsFiltered: 6,
        recordsTotal: 6,
        data: tableRows(parameters, scopedInlineValues(request)),
    })
}

async function handleSelectSearch(request, response, url) {
    const parameters = await readParameters(request, url)
    recordRequest('select-search', request, parameters)

    if (parameters.q === 'error') {
        response.writeHead(500, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify({ message: 'Search unavailable' }))
        return
    }

    sendJson(response, [
        { custom_name: null, id: 'borealis', tag_name: 'Borealis' },
        { custom_name: '<strong>Aurora</strong>', id: 'aurora', tag_name: 'Aurora' },
    ])
}

async function handleDependentSelect(request, response, url) {
    const parameters = await readParameters(request, url)
    recordRequest('dependent-select', request, parameters)
    const country = parameters['depdrop_all_params[country]']

    if (country === 'error') {
        response.writeHead(503, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify({ message: 'Dependent options unavailable' }))
        return
    }

    const options =
        country === 'de'
            ? [{ id: 'berlin', name: 'Berlin' }]
            : {
                  lyon: { id: 'lyon', name: 'Lyon' },
                  paris: { id: 'paris', name: 'Paris' },
              }
    sendJson(response, {
        output: options,
        selected: country === 'de' ? 'berlin' : 'paris',
    })
}

async function handleInlineEdit(request, response, url) {
    const parameters = await readInlineEditParameters(request, url)
    recordRequest('inline-edit', request, parameters)

    if (parameters.value === 'invalid') {
        response.writeHead(422, { 'Content-Type': 'application/json' })
        response.end(
            JSON.stringify({ errors: { status: ['The status is invalid.'] }, message: 'Invalid' }),
        )
        return
    }

    const newValue =
        parameters.name === 'status' && parameters.pk === '1'
            ? 'Server normalized'
            : (parameters['value[]'] ?? parameters.value)
    scopedInlineValues(request).set(parameters.pk, newValue)
    sendJson(response, { newValue, status: true })
}

async function handleTreeReorder(request, response, url) {
    const parameters = await readParameters(request, url)
    recordRequest('tree-reorder', request, parameters)

    if (url.searchParams.has('fail')) {
        response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
        response.end('Unable to save tree')
        return
    }

    response.writeHead(204).end()
}

async function handleFilesUpload(request, response) {
    const body = await readBody(request)
    const filename = body.match(/filename="([^"]+)"/)?.[1] ?? ''
    const validCsrf =
        request.headers['x-csrf-token'] === 'files-meta-token' && body.includes('files-form-token')

    if (!validCsrf) {
        response.writeHead(419, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify({ errors: ['Invalid CSRF token'], message: 'Expired' }))
        return
    }
    if (filename === 'broken.txt') {
        response.writeHead(422, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify({ errors: ['Broken fixture file'], message: 'Invalid upload' }))
        return
    }

    sendJson(response, {
        desc: `Description ${filename}`,
        original_name: filename,
        path: filename.toLowerCase().endsWith('.svg')
            ? '/fixtures/pixel.svg'
            : `/downloads/${filename}`,
        title: `Title ${filename}`,
        value: `uploads/${filename}`,
    })
}

async function readInlineEditParameters(request, url) {
    if (request.method === 'GET') return Object.fromEntries(url.searchParams)

    const body = new URLSearchParams(await readBody(request))
    const parameters = Object.fromEntries(body)
    const values = body.getAll('value[]')
    if (values.length) parameters['value[]'] = values

    return parameters
}

async function handleMutation(kind, request, response, url) {
    const parameters = await readParameters(request, url)
    recordRequest(kind, request, parameters)
    sendJson(response, mutationResult(kind))
}

function mutationResult(kind) {
    if (kind === 'inline-edit') {
        return { status: true, newValue: 'Server normalized' }
    }
    if (kind === 'action-form') {
        return { message: 'Rows updated', text: 'Custom action complete', type: 'success' }
    }

    return {}
}

function resetFixture(request, response) {
    scopedRequests(request).length = 0
    scopedInlineValues(request).clear()
    sendJson(response, { ok: true })
}

function sendPixel(response) {
    response.writeHead(200, { 'Content-Type': 'image/svg+xml' })
    response.end('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>')
}

function sendRuntimeAsset(response, path) {
    if (path.endsWith('.js')) {
        response.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8' })
        response.end(
            `window.__runtimeAssetLoads = [...(window.__runtimeAssetLoads || []), ${JSON.stringify(path)}]`,
        )
        return
    }

    response.writeHead(200, { 'Content-Type': 'text/css; charset=utf-8' })
    response.end(':root { --fixture-runtime-asset: 1; }')
}

function serveFixtureAsset(response, path) {
    if (path === '/fixtures/pixel.svg') {
        sendPixel(response)
        return true
    }
    if (path.startsWith('/fixtures/') && /\.(css|js)$/.test(path)) {
        sendRuntimeAsset(response, path)
        return true
    }

    return false
}

const apiHandlers = new Map([
    ['/api/datatables', handleTable],
    ['/api/dependent-options', handleDependentSelect],
    ['/api/inline-edit', handleInlineEdit],
    ['/api/tree/reorder', handleTreeReorder],
    ['/api/select-search', handleSelectSearch],
    ['/api/files-upload', handleFilesUpload],
])

async function serveApi(request, response, url) {
    const handler = apiHandlers.get(url.pathname)
    if (!handler) return false

    await handler(request, response, url)

    return true
}

async function respond(request, response) {
    const url = new URL(request.url, origin)
    const route = staticRoutes.get(url.pathname)

    if (route) {
        serveFile(response, route)
        return
    }

    if (await serveApi(request, response, url)) return

    const mutations = new Map([
        ['/api/action', 'action'],
        ['/api/action-form', 'action-form'],
    ])
    const mutation = mutations.get(url.pathname)

    if (mutation) {
        await handleMutation(mutation, request, response, url)
        return
    }

    if (url.pathname === '/__fixture/requests') {
        sendJson(response, { requests: scopedRequests(request) })
        return
    }

    if (url.pathname === '/__fixture/reset') {
        resetFixture(request, response)
        return
    }

    if (serveFixtureAsset(response, url.pathname)) {
        return
    }

    response.writeHead(404).end('Not found')
}

function handleFailure(response, error) {
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
    response.end(error instanceof Error ? error.message : String(error))
}

createServer((request, response) => {
    respond(request, response).catch((error) => handleFailure(response, error))
}).listen(4173, '127.0.0.1')
