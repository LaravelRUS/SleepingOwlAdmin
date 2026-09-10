import { spawnSync } from 'node:child_process'
import { readFileSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { exit } from 'node:process'
import { clearTimeout, setTimeout } from 'node:timers'
import { build } from 'vite'

import { createAssetConfig, projectRoot } from '../../vite.config.mjs'

const profile = process.argv[2] ?? 'development'
const watch = process.argv.includes('--watch')
const poll = process.argv.includes('--poll')
const entries = frontendEntries()
const refreshManifest = watch ? manifestRefresh(profile) : null

for (const entry of entries) {
    prepareOutput(entry, profile)
    await build(createAssetConfig(entry, profile, { onBuilt: refreshManifest, poll, watch }))
}

if (watch) {
    refreshManifest()
    console.log(`Watching ${entries.length} Vite entries for the ${profile} profile.`)
} else {
    generateAssetManifest(profile)
    console.log(`Vite ${profile} profile built (${entries.length} entries).`)
}

function frontendEntries() {
    const path = resolve(projectRoot, 'build/frontend-entries.json')
    const groups = Object.values(JSON.parse(readFileSync(path, 'utf8')))

    return groups.flatMap((group) => [
        ...group.scripts.map((entry) => ({ ...entry, type: 'script' })),
        ...group.styles.map((entry) => ({ ...entry, type: 'style' })),
    ])
}

function generateAssetManifest(assetProfile) {
    const result = spawnSync(
        'php',
        ['scripts/modernization/generate-asset-manifest.php', assetProfile],
        { cwd: projectRoot, stdio: 'inherit' },
    )

    if (result.error) throw result.error
    if (result.status !== 0) exit(result.status ?? 1)
}

function prepareOutput(entry, assetProfile) {
    const output = resolve(projectRoot, 'public/default', entry.output)

    rmSync(output, { force: true })

    if (assetProfile === 'production') {
        rmSync(`${output}.LICENSE.txt`, { force: true })
        rmSync(`${output}.map`, { force: true })
    }
}

function manifestRefresh(assetProfile) {
    let timer

    return () => {
        clearTimeout(timer)
        timer = setTimeout(() => generateAssetManifest(assetProfile), 150)
    }
}
