const mix = require('laravel-mix')
const { execFileSync } = require('node:child_process')
const frontendEntries = require('./build/frontend-entries.json')
const { resolveVueRuntime } = require('./build/vue-runtime')
const assetProfile = resolveAssetProfile()

mix.setPublicPath('./public/default/')

mix.webpackConfig({
    resolve: {
        alias: {
            vue$: resolveVueRuntime(__dirname, assetProfile),
        },
    },
    stats: {
        children: true,
    },
    infrastructureLogging: {
        level: 'none',
    },
})

registerEntries(frontendEntries)

mix.then(() => generateAssetManifest(assetProfile))

mix.options({
    processCssUrls: true,
    resourceRoot: '../',
    imgLoaderOptions: {
        enabled: false,
    },
    progress: false,
})

if (assetProfile === 'development') {
    mix.sourceMaps(false, 'source-map')
}

if (mix.inProduction()) {
    mix.version()
}

mix.disableNotifications()

function registerEntries(groups) {
    const entries = Object.values(groups)

    entries.forEach(registerScripts)
    entries.forEach(registerStyles)
}

function registerScripts(group) {
    group.scripts.forEach(({ source, output }) => mix.js(source, output))
}

function registerStyles(group) {
    group.styles.forEach(({ source, output }) => mix.sass(source, output))
}

function generateAssetManifest(profile) {
    execFileSync('php', ['scripts/modernization/generate-asset-manifest.php', profile], {
        cwd: __dirname,
        stdio: 'inherit',
    })
}

function resolveAssetProfile() {
    const profile =
        process.env.SOA_ASSET_PROFILE || (mix.inProduction() ? 'production' : 'development')

    if (!['production', 'development'].includes(profile)) {
        throw new Error(`Unsupported SOA_ASSET_PROFILE [${profile}].`)
    }

    return profile
}
