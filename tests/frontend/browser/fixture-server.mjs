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
        '/island-props-csp',
        [join(browserDirectory, 'island-props-csp.html'), 'text/html; charset=utf-8'],
    ],
    ['/dom-listeners', [join(browserDirectory, 'dom-listeners.html'), 'text/html; charset=utf-8']],
    [
        '/legacy-datatables',
        [join(browserDirectory, 'legacy-datatables.html'), 'text/html; charset=utf-8'],
    ],
    ['/legacy-vue', [join(browserDirectory, 'legacy-vue.html'), 'text/html; charset=utf-8']],
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
        '/public/default/css/admin-app.css',
        [join(projectRoot, 'public', 'default', 'css', 'admin-app.css'), 'text/css'],
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
        '/fixtures/custom-vue-island.js',
        [join(browserDirectory, 'custom-vue-island.js'), 'text/javascript; charset=utf-8'],
    ],
])

const fixtureState = {
    requests: [],
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
    fixtureState.requests.push({
        kind,
        method: request.method,
        parameters,
        url: request.url,
    })
}

function editableCell(id) {
    return `<a href="#" class="inline-editable" id="inline-edit-${id}" data-name="status" data-value="Draft" data-url="/api/inline-edit" data-type="text" data-pk="${id}" data-mode="inline">Draft</a>`
}

function fixtureRow(id) {
    return [
        `<input type="checkbox" class="adminCheckboxRow" name="_id[]" value="${id}">`,
        editableCell(id),
        `2026-09-0${id}`,
        String(id * 10),
        id % 2 === 0 ? 'archived' : 'active',
        '2026-09-01 - 2026-09-06',
        `<span id="draw-tooltip-${id}" data-toggle="tooltip" title="row ${id}">row ${id}</span><img id="lazy-image-${id}" class="lazyload" data-src="/fixtures/pixel.svg" alt="">`,
        { add_class: 'fixture-row' },
    ]
}

function tableRows(parameters) {
    const ids = [1, 2, 3, 4, 5, 6]
    const start = Number(parameters.start || 0)
    const length = Number(parameters.length || 2)
    const visible = length === -1 ? ids.slice(start) : ids.slice(start, start + length)

    return visible.map(fixtureRow)
}

async function handleTable(request, response, url) {
    const parameters = await readParameters(request, url)
    recordRequest('datatable', request, parameters)
    sendJson(response, {
        draw: Number(parameters.draw || 0),
        recordsFiltered: 6,
        recordsTotal: 6,
        data: tableRows(parameters),
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

function resetFixture(response) {
    fixtureState.requests.length = 0
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

async function respond(request, response) {
    const url = new URL(request.url, origin)
    const route = staticRoutes.get(url.pathname)

    if (route) {
        serveFile(response, route)
        return
    }

    if (url.pathname === '/api/datatables') {
        await handleTable(request, response, url)
        return
    }

    if (url.pathname === '/api/select-search') {
        await handleSelectSearch(request, response, url)
        return
    }

    const mutations = new Map([
        ['/api/action', 'action'],
        ['/api/action-form', 'action-form'],
        ['/api/inline-edit', 'inline-edit'],
    ])
    const mutation = mutations.get(url.pathname)

    if (mutation) {
        await handleMutation(mutation, request, response, url)
        return
    }

    if (url.pathname === '/__fixture/requests') {
        sendJson(response, fixtureState)
        return
    }

    if (url.pathname === '/__fixture/reset') {
        resetFixture(response)
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
