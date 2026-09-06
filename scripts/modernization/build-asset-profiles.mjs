import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'
import { env, execPath, exit } from 'node:process'
import { fileURLToPath, URL } from 'node:url'

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)))
const mixCli = resolve(root, 'node_modules/laravel-mix/bin/cli.js')

buildProfile('development')
buildProfile('production', ['--production'])

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
