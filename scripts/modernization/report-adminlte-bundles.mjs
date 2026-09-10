import { readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { resolve } from 'node:path'
import { argv } from 'node:process'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)))
const manifestFile = 'public/default/asset-manifest.json'
const baselineFile = 'docs/modernization/baseline/frontend.json'
const reportFile = 'docs/modernization/adminlte-bundle-measurements.json'
const assetTypes = ['scripts', 'styles']

export function buildAdminLteBundleReport() {
    const manifest = readJson(manifestFile)
    const baseline = readJson(baselineFile).productionBundles.totals
    const profiles = Object.fromEntries(
        Object.entries(manifest.profiles).map(([name, profile]) => [
            name,
            buildProfileReport(profile.entries),
        ]),
    )

    return {
        schemaVersion: 1,
        sourceManifest: manifestFile,
        packageVersion: manifest.package_version,
        buildId: manifest.build_id,
        baseline: { source: baselineFile, ...baseline },
        profiles,
        productionVsLegacyAggregate: compareTotals(profiles.production.totals, baseline),
    }
}

export function writeAdminLteBundleReport() {
    const report = buildAdminLteBundleReport()
    const path = resolve(root, reportFile)

    rmSync(path, { force: true })
    writeFileSync(path, `${JSON.stringify(report, null, 2)}\n`)
    return report
}

function buildProfileReport(entries) {
    const selected = Object.entries(entries).filter(([logicalId]) => isAdminLteEntry(logicalId))
    const reports = Object.fromEntries(
        selected.map(([logicalId, entry]) => [logicalId, buildEntryReport(entry)]),
    )

    return {
        entries: reports,
        totals: summarize(uniqueAssets(reports)),
    }
}

function isAdminLteEntry(logicalId) {
    return (
        logicalId === 'core' ||
        logicalId.startsWith('shared:') ||
        logicalId === 'theme:adminlte' ||
        /^feature:[^:]+$/.test(logicalId) ||
        logicalId.endsWith(':theme:adminlte')
    )
}

function buildEntryReport(entry) {
    const assets = assetTypes.flatMap((type) =>
        entry[type].map((asset) => buildAssetReport(type, asset)),
    )

    return { assets, totals: summarize(assets) }
}

function buildAssetReport(type, asset) {
    const path = resolve(root, 'public/default', asset.file)
    const contents = readFileSync(path)

    return {
        type,
        file: asset.file,
        version: asset.version,
        checksum: asset.checksum,
        bytes: statSync(path).size,
        gzipBytes: gzipSync(contents, { level: 9 }).length,
    }
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

function compareTotals(current, baseline) {
    return {
        bytes: compareValue(current.bytes, baseline.bytes),
        gzipBytes: compareValue(current.gzipBytes, baseline.gzipBytes),
    }
}

function compareValue(current, baseline) {
    const delta = current - baseline

    return {
        current,
        baseline,
        delta,
        percent: Number(((delta / baseline) * 100).toFixed(1)),
    }
}

function readJson(path) {
    return JSON.parse(readFileSync(resolve(root, path), 'utf8'))
}

if (argv[1] && resolve(argv[1]) === fileURLToPath(import.meta.url)) {
    const report = writeAdminLteBundleReport()
    const totals = report.profiles.production.totals

    console.log(
        `AdminLTE production runtime: ${totals.files} files, ${totals.bytes} bytes, ${totals.gzipBytes} gzip bytes`,
    )
}
