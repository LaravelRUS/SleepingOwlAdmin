import { spawnSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { execPath, exit } from 'node:process'
import { fileURLToPath, URL } from 'node:url'

import { writeAdminLteBundleReport } from './report-adminlte-bundles.mjs'
import { writeTablerBundleReport } from './report-tabler-bundles.mjs'

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)))
const viteProfileBuilder = resolve(root, 'scripts/modernization/build-vite-profile.mjs')

buildProfile('development')
const developmentAssets = captureDevelopmentAssets()
buildProfile('production')
restoreDevelopmentAssets(developmentAssets)
writeAdminLteBundleReport()
writeTablerBundleReport()

function buildProfile(profile) {
    const result = spawnSync(execPath, [viteProfileBuilder, profile], {
        cwd: root,
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
}

function readPublicFile(path) {
    return readFileSync(resolve(root, 'public/default', path))
}

function writePublicFile(path, contents) {
    writeFileSync(resolve(root, 'public/default', path), contents)
}
