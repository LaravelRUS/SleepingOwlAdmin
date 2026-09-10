import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { extname, resolve } from 'node:path'
import { argv } from 'node:process'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)))
const manifestFile = 'public/default/asset-manifest.json'
const reportFile = 'docs/modernization/tabler-bundle-report.json'
const licenseFile = 'docs/modernization/licenses/tabler-MIT.md'
const tablerRoot = 'node_modules/@tabler/core'
const assetTypes = ['scripts', 'styles']

export function buildTablerBundleReport() {
    const manifest = readJson(manifestFile)
    const dependency = readJson(`${tablerRoot}/package.json`)
    const lock = readJson('package-lock.json').packages[`node_modules/@tabler/core`]
    const files = walk(resolve(root, tablerRoot))
    const profiles = Object.fromEntries(
        Object.entries(manifest.profiles).map(([name, profile]) => [
            name,
            buildProfileReport(profile.entries),
        ]),
    )
    const productionCss = profiles.production.entries['theme:tabler'].assets[0]
    const css = read(`public/default/${productionCss.file}`)

    return {
        schemaVersion: 1,
        sourceManifest: manifestFile,
        packageVersion: manifest.package_version,
        buildId: manifest.build_id,
        upstream: {
            package: dependency.name,
            version: dependency.version,
            source: dependency.repository.url,
            tarball: lock.resolved,
            integrity: lock.integrity,
            license: dependency.license,
            licenseNotice: licenseFile,
            licenseChecksum: `sha256:${sha256(readRaw(licenseFile))}`,
            node: dependency.engines.node,
            dependencies: dependency.dependencies,
        },
        staticInventory: countExtensions(files),
        selection: {
            source: '@tabler/core/dist/css/tabler.css',
            publishedStaticFiles: 0,
            publishedThemeScripts: 0,
            externalAssetUrls: assetUrls(css).filter((url) => !url.startsWith('data:')),
        },
        profiles,
        isolation: Object.fromEntries(
            ['adminlte', 'tailwind', 'jquery', 'font awesome'].map((needle) => [
                needle,
                css.toLowerCase().includes(needle),
            ]),
        ),
    }
}

export function writeTablerBundleReport() {
    const report = buildTablerBundleReport()
    const path = resolve(root, reportFile)

    rmSync(path, { force: true })
    writeFileSync(path, `${JSON.stringify(report, null, 2)}\n`)
    return report
}

function buildProfileReport(entries) {
    const selected = Object.entries(entries).filter(
        ([logicalId]) =>
            logicalId === 'core' || logicalId.startsWith('shared:') || logicalId === 'theme:tabler',
    )
    const reports = Object.fromEntries(
        selected.map(([logicalId, entry]) => [logicalId, buildEntryReport(entry)]),
    )

    return { entries: reports, totals: summarize(uniqueAssets(reports)) }
}

function buildEntryReport(entry) {
    const assets = assetTypes.flatMap((type) =>
        entry[type].map((asset) => ({
            type,
            file: asset.file,
            version: asset.version,
            checksum: asset.checksum,
            bytes: statSync(resolve(root, 'public/default', asset.file)).size,
            gzipBytes: gzipSync(readRaw(resolve('public/default', asset.file)), { level: 9 })
                .length,
        })),
    )

    return { assets, totals: summarize(assets) }
}

function uniqueAssets(entries) {
    const assets = Object.values(entries).flatMap((entry) => entry.assets)
    return [...new Map(assets.map((asset) => [asset.file, asset])).values()]
}

function summarize(assets) {
    return {
        files: assets.length,
        bytes: assets.reduce((sum, asset) => sum + asset.bytes, 0),
        gzipBytes: assets.reduce((sum, asset) => sum + asset.gzipBytes, 0),
    }
}

function countExtensions(files) {
    const counts = {}
    for (const path of files) {
        const extension = extname(path).slice(1) || '(none)'
        counts[extension] = (counts[extension] || 0) + 1
    }
    return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)))
}

function assetUrls(css) {
    return [...css.matchAll(/url\((["']?)(.*?)\1\)/g)].map((match) => match[2])
}

function walk(directory) {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const path = resolve(directory, entry.name)
        return entry.isDirectory() ? walk(path) : [path]
    })
}

function readJson(path) {
    return JSON.parse(read(path))
}

function read(path) {
    return readRaw(path).toString('utf8')
}

function readRaw(path) {
    return readFileSync(resolve(root, path))
}

function sha256(contents) {
    return createHash('sha256').update(contents).digest('hex')
}

if (argv[1] && resolve(argv[1]) === fileURLToPath(import.meta.url)) {
    const report = writeTablerBundleReport()
    const totals = report.profiles.production.totals
    console.log(
        `Tabler production runtime: ${totals.files} files, ${totals.bytes} bytes, ${totals.gzipBytes} gzip bytes`,
    )
}
