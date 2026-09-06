import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, '..', '..');
const outputPath = join(projectRoot, 'docs', 'modernization', 'baseline', 'frontend.json');
const assetRoot = join(projectRoot, 'public', 'default');
const productionEntries = [
    '/css/admin-app.css',
    '/js/admin-app.js',
    '/js/vue.js',
    '/js/modules.js',
];

function readJson(path) {
    return JSON.parse(readFileSync(path, 'utf8'));
}

function packageName(path) {
    const tail = path.split('node_modules/').at(-1);
    const parts = tail.split('/');

    return parts[0].startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
}

function packageManifest(path) {
    const manifestPath = join(projectRoot, path, 'package.json');

    return existsSync(manifestPath) ? readJson(manifestPath) : {};
}

function normalizeLicense(value) {
    if (typeof value === 'string') {
        return value;
    }

    if (Array.isArray(value)) {
        return value.map(normalizeLicense).join(' OR ');
    }

    return value?.type ?? 'UNKNOWN';
}

function runtimePackages(lock) {
    const direct = new Set(Object.keys(lock.packages[''].dependencies ?? {}));
    const packages = Object.entries(lock.packages)
        .filter(([path, metadata]) => path && metadata.version && !metadata.dev)
        .map(([path, metadata]) => makePackage(path, metadata, direct));

    return uniquePackages(packages);
}

function makePackage(path, metadata, direct) {
    const manifest = packageManifest(path);
    const name = manifest.name ?? packageName(path);

    return {
        name,
        version: metadata.version,
        license: normalizeLicense(metadata.license ?? manifest.license),
        direct: direct.has(name),
    };
}

function uniquePackages(packages) {
    const unique = new Map();

    for (const item of packages) {
        unique.set(`${item.name}@${item.version}`, item);
    }

    return [...unique.values()].sort((left, right) =>
        `${left.name}@${left.version}`.localeCompare(`${right.name}@${right.version}`),
    );
}

function licenseSummary(packages) {
    const counts = new Map();

    for (const item of packages) {
        counts.set(item.license, (counts.get(item.license) ?? 0) + 1);
    }

    return [...counts.entries()]
        .map(([license, count]) => ({ license, packages: count }))
        .sort((left, right) => left.license.localeCompare(right.license));
}

function assetDetails(entry, manifest) {
    const relativePath = manifest[entry].split('?')[0].replace(/^\//, '');
    const contents = readFileSync(join(assetRoot, relativePath));

    return {
        entry,
        file: `public/default/${relativePath}`,
        bytes: contents.length,
        gzipBytes: gzipSync(contents, { level: 9 }).length,
        sha256: createHash('sha256').update(contents).digest('hex'),
    };
}

function assetReport() {
    const manifest = readJson(join(assetRoot, 'mix-manifest.json'));
    const assets = productionEntries.map((entry) => assetDetails(entry, manifest));

    return {
        assets,
        totals: {
            bytes: assets.reduce((sum, item) => sum + item.bytes, 0),
            gzipBytes: assets.reduce((sum, item) => sum + item.gzipBytes, 0),
        },
    };
}

function buildReport() {
    const lockPath = join(projectRoot, 'package-lock.json');
    const lock = readJson(lockPath);
    const packages = runtimePackages(lock);

    return {
        formatVersion: 1,
        toolchain: { node: process.version, lockfileVersion: lock.lockfileVersion },
        packageLockSha256: createHash('sha256').update(readFileSync(lockPath)).digest('hex'),
        productionBundles: assetReport(),
        runtimeDependencies: {
            packages: packages.length,
            licenses: licenseSummary(packages),
            inventory: packages,
        },
    };
}

function writeReport(report) {
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
}

writeReport(buildReport());
console.log(`Frontend baseline written to ${outputPath}`);
