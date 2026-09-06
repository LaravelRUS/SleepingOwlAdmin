import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { env, execPath, exit } from 'node:process'
import { fileURLToPath, URL } from 'node:url'

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)))
const mixCli = resolve(root, 'node_modules/laravel-mix/bin/cli.js')

buildProfile('development')
const developmentApp = captureDevelopmentApp()
buildProfile('production', ['--production'])
restoreDevelopmentApp(developmentApp)

function buildProfile(profile, arguments_ = []) {
    const result = spawnSync(execPath, [mixCli, ...arguments_], {
        cwd: root,
        env: { ...env, SOA_ASSET_PROFILE: profile },
        stdio: 'inherit',
    })

    if (result.error) {
        throw result.error
    }

    if (result.status !== 0) {
        exit(result.status ?? 1)
    }
}

function captureDevelopmentApp() {
    return {
        bundle: readPublicFile('js/admin-app-dev.js'),
        sourceMap: readPublicFile('js/admin-app-dev.js.map'),
    }
}

function restoreDevelopmentApp(app) {
    writePublicFile('js/admin-app-dev.js', app.bundle)
    writePublicFile('js/admin-app-dev.js.map', app.sourceMap)
    updateDevelopmentVersion(app.bundle)
}

function updateDevelopmentVersion(bundle) {
    const path = resolve(root, 'public/default/mix-manifest.json')
    const manifest = JSON.parse(readFileSync(path, 'utf8'))
    const version = createHash('md5').update(bundle).digest('hex')

    manifest['/js/admin-app-dev.js'] = `/js/admin-app-dev.js?id=${version}`
    writeFileSync(path, `${JSON.stringify(manifest, null, 4)}\n`)
}

function readPublicFile(path) {
    return readFileSync(resolve(root, 'public/default', path))
}

function writePublicFile(path, contents) {
    writeFileSync(resolve(root, 'public/default', path), contents)
}
