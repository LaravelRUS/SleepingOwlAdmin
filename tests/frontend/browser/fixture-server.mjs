import { createReadStream } from 'node:fs'
import { createServer } from 'node:http'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const browserDirectory = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(browserDirectory, '..', '..', '..')
const routes = new Map([
    ['/', [join(browserDirectory, 'island-props.html'), 'text/html; charset=utf-8']],
    [
        '/resources/frontend/core/data/island-props.js',
        [
            join(projectRoot, 'resources', 'frontend', 'core', 'data', 'island-props.js'),
            'text/javascript',
        ],
    ],
])

function respond(request, response) {
    const route = routes.get(request.url)

    if (!route) {
        response.writeHead(404).end('Not found')
        return
    }

    const [path, contentType] = route
    response.writeHead(200, { 'Content-Type': contentType })
    createReadStream(path).pipe(response)
}

createServer(respond).listen(4173, '127.0.0.1')
