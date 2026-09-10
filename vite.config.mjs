import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'
import { readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, extname, isAbsolute, relative, resolve } from 'node:path'
import postcss from 'postcss'
import { defineConfig } from 'vite'

export const projectRoot = import.meta.dirname
export const publicRoot = resolve(projectRoot, 'public/default')

const supportedProfiles = new Set(['development', 'production'])

export function createAssetConfig(entry, profile, options = {}) {
    assertProfile(profile)

    const production = profile === 'production'
    const style = entry.type === 'style'
    const plugins = style ? [removeStyleEntryChunk(), finalizeStyle(entry, !production)] : [vue()]

    if (production && !style) {
        plugins.push(licenseReference(entry.output))
    }
    if (options.onBuilt) plugins.push(buildCallback(options.onBuilt))

    return {
        appType: 'custom',
        base: './',
        build: buildOptions(entry, production, options),
        configFile: false,
        css: cssOptions(entry, !production),
        define: vueCompileFlags(production),
        esbuild: { legalComments: 'inline' },
        logLevel: 'warn',
        plugins,
        publicDir: false,
        resolve: {
            alias: [{ find: /^vue$/, replacement: resolveVueRuntime() }],
        },
        root: projectRoot,
    }
}

function buildOptions(entry, production, options) {
    return {
        assetsInlineLimit: 0,
        copyPublicDir: false,
        cssCodeSplit: true,
        cssMinify: production ? 'esbuild' : false,
        emptyOutDir: false,
        license: production && entry.type === 'script' ? licenseOptions(entry.output) : false,
        minify: production,
        outDir: publicRoot,
        rollupOptions: rollupOptions(entry),
        sourcemap: !production,
        target: 'es2018',
        watch: options.watch ? watchOptions(options.poll) : null,
    }
}

function rollupOptions(entry) {
    return {
        input: resolve(projectRoot, entry.source),
        output: outputOptions(entry),
    }
}

function outputOptions(entry) {
    const output = {
        assetFileNames: (asset) => assetFileName(asset, entry.output),
        entryFileNames: entry.output,
        format: entry.type === 'style' ? 'es' : 'iife',
    }

    if (entry.type === 'script') output.name = 'SleepingOwlAsset'

    return output
}

function cssOptions(entry, sourceMap) {
    return {
        devSourcemap: sourceMap,
        postcss: { plugins: postcssPlugins(entry) },
        preprocessorOptions: {
            scss: {
                silenceDeprecations: [
                    'color-functions',
                    'function-units',
                    'global-builtin',
                    'if-function',
                    'import',
                ],
            },
        },
    }
}

function postcssPlugins(entry) {
    return entry.processor === 'tailwind' ? [tailwindcss(), autoprefixer()] : [autoprefixer()]
}

function assetFileName(asset, stylesheetOutput) {
    const names = asset.names ?? (asset.name ? [asset.name] : [])
    const extension = extname(names[0] ?? '')

    if (extension === '.css') return stylesheetOutput
    if (extension === '.woff2') {
        return 'fonts/vendor/@fortawesome/fontawesome-free/web[name][extname]'
    }
    if (extension === '.ttf') return 'fonts/[name][extname]'

    return 'assets/[name][extname]'
}

function resolveVueRuntime() {
    return resolve(projectRoot, 'node_modules/vue/dist/vue.runtime.esm-bundler.js')
}

function vueCompileFlags(production) {
    return {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: production ? 'false' : 'true',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: production ? 'false' : 'true',
        global: 'globalThis',
    }
}

function licenseOptions(output) {
    return { fileName: `${output}.LICENSE.txt` }
}

function licenseReference(output) {
    return {
        generateBundle(_options, bundle) {
            for (const item of Object.values(bundle)) {
                if (item.type === 'chunk') {
                    item.code += `\n/*! For license information please see ${output.split('/').at(-1)}.LICENSE.txt */\n`
                }
            }
        },
        name: 'sleepingowl-license-reference',
    }
}

function finalizeStyle(entry, sourceMap) {
    let compiledSourceMap

    return {
        name: 'sleepingowl-finalize-style',
        transform(_source, id) {
            if (!sourceMap || normalizePath(id.split('?')[0]) !== normalizePath(entry.source)) {
                return null
            }

            const map = this.getCombinedSourcemap()
            if (map.mappings) compiledSourceMap = map

            return null
        },
        writeBundle: {
            async handler() {
                const path = resolve(publicRoot, entry.output)
                const source = readFileSync(path, 'utf8').replaceAll(/\/\*\$vite\$:\d+\*\//g, '')
                if (!sourceMap) {
                    writeFileSync(path, source)
                    return
                }

                if (!compiledSourceMap) {
                    throw new Error(`Vite did not expose a CSS source map for [${entry.source}].`)
                }

                const result = await postcss().process(source, {
                    from: resolve(projectRoot, entry.source),
                    map: {
                        annotation: `${basename(entry.output)}.map`,
                        inline: false,
                        prev: compiledSourceMap,
                        sourcesContent: true,
                    },
                    to: path,
                })

                writeFileSync(path, result.css)
                writeFileSync(`${path}.map`, serializeSourceMap(result.map, path))
            },
            order: 'post',
        },
    }
}

function normalizePath(path) {
    return resolve(projectRoot, path).replaceAll('\\', '/')
}

function serializeSourceMap(map, output) {
    const sourceMap = map.toJSON()
    sourceMap.sources = sourceMap.sources.map((source) =>
        (isAbsolute(source) ? relative(dirname(output), source) : source).replaceAll('\\', '/'),
    )

    return JSON.stringify(sourceMap)
}

function removeStyleEntryChunk() {
    return {
        generateBundle(_options, bundle) {
            for (const [file, item] of Object.entries(bundle)) {
                if (item.type === 'chunk') delete bundle[file]
            }
        },
        name: 'sleepingowl-remove-style-entry-chunk',
    }
}

function watchOptions(poll) {
    return poll ? { chokidar: { usePolling: true } } : {}
}

function buildCallback(callback) {
    return {
        name: 'sleepingowl-build-callback',
        writeBundle: { handler: callback, order: 'post' },
    }
}

function assertProfile(profile) {
    if (!supportedProfiles.has(profile)) {
        throw new Error(`Unsupported Vite asset profile [${profile}].`)
    }
}

export default defineConfig(
    createAssetConfig(
        {
            output: 'js/admin-app-dev.js',
            source: 'resources/js/shared/legacy/app-dev.js',
            type: 'script',
        },
        'development',
    ),
)
