import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { env, execPath, exit } from 'node:process'
import { fileURLToPath, URL } from 'node:url'

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)))
const mixCli = resolve(root, 'node_modules/laravel-mix/bin/cli.js')

buildProfile('development')
const developmentAssets = captureDevelopmentAssets()
buildProfile('production', ['--production'])
restoreDevelopmentAssets(developmentAssets)

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

function captureDevelopmentAssets() {
    return {
        app: captureAsset('js/admin-app-dev.js'),
        vue: captureAsset('js/vue-dev.js'),
    }
}

function captureAsset(path) {
    return {
        bundle: readPublicFile(path),
        path,
        sourceMap: readPublicFile(`${path}.map`),
    }
}

function restoreDevelopmentAssets(assets) {
    Object.values(assets).forEach(restoreDevelopmentAsset)
}

function restoreDevelopmentAsset(asset) {
    writePublicFile(asset.path, asset.bundle)
    writePublicFile(`${asset.path}.map`, asset.sourceMap)
    updateDevelopmentVersion(asset.path, asset.bundle)
}

function updateDevelopmentVersion(assetPath, bundle) {
    const path = resolve(root, 'public/default/mix-manifest.json')
    const manifest = JSON.parse(readFileSync(path, 'utf8'))
    const version = createHash('md5').update(bundle).digest('hex')

    manifest[`/${assetPath}`] = `/${assetPath}?id=${version}`
    writeFileSync(path, `${JSON.stringify(manifest, null, 4)}\n`)
}

function readPublicFile(path) {
    return readFileSync(resolve(root, 'public/default', path))
}

function writePublicFile(path, contents) {
    writeFileSync(resolve(root, 'public/default', path), contents)
}
