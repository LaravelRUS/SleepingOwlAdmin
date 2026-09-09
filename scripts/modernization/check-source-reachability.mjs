import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, extname, relative, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '../..')
const sourceRoots = ['resources/js', 'resources/css']
const sourceExtensions = new Set(['.js', '.cjs', '.vue', '.scss', '.css'])
const sources = new Set(sourceRoots.flatMap(filesUnder).map((path) => resolve(root, path)))
const entries = JSON.parse(readFileSync(resolve(root, 'build/frontend-entries.json'), 'utf8'))
const buildRoots = Object.values(entries)
    .flatMap(({ scripts, styles }) => [...scripts, ...styles])
    .map(({ source }) => resolve(root, source))
const apiRoots = [...sources].filter((path) => path.endsWith(`${separator()}index.js`))
const queue = [...new Set([...buildRoots, ...apiRoots])]
const reached = new Set()
const missing = []

while (queue.length > 0) {
    const source = queue.pop()
    if (reached.has(source) || !sources.has(source)) continue

    reached.add(source)

    for (const specifier of dependencies(source)) {
        const dependency = resolveDependency(source, specifier)

        if (dependency && sources.has(dependency) && !reached.has(dependency)) {
            queue.push(dependency)
        } else if (!dependency && specifier.startsWith('.')) {
            missing.push(`${projectPath(source)} -> ${specifier}`)
        }
    }
}

const unreachable = [...sources]
    .filter((path) => !reached.has(path))
    .map(projectPath)
    .sort()

if (missing.length > 0 || unreachable.length > 0) {
    if (missing.length > 0) {
        console.error('Missing relative source dependencies:')
        missing.sort().forEach((path) => console.error(`- ${path}`))
    }

    if (unreachable.length > 0) {
        console.error('Unreachable frontend sources:')
        unreachable.forEach((path) => console.error(`- ${path}`))
    }

    process.exitCode = 1
} else {
    console.log(`Frontend source reachability: ${reached.size}/${sources.size} files reachable.`)
}

function filesUnder(sourceRoot) {
    const absoluteRoot = resolve(root, sourceRoot)

    return readdirSync(absoluteRoot, { recursive: true, withFileTypes: true })
        .filter((entry) => entry.isFile() && sourceExtensions.has(extname(entry.name)))
        .map((entry) => relative(root, resolve(entry.parentPath, entry.name)))
}

function dependencies(source) {
    const contents = readFileSync(source, 'utf8')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^\s*\/\/.*$/gm, '')
    const extension = extname(source)
    const patterns =
        extension === '.scss' || extension === '.css'
            ? [
                  /@(?:use|forward|import|config)\s+(?:url\()?['"]([^'"]+)['"]/g,
                  /meta\.load-css\(\s*['"]([^'"]+)['"]/g,
              ]
            : [
                  /\b(?:from|import\s*\(|require\s*\()\s*['"]([^'"]+)['"]/g,
                  /\bimport\s*['"]([^'"]+)['"]/g,
              ]

    return patterns.flatMap((pattern) => [...contents.matchAll(pattern)].map((match) => match[1]))
}

function resolveDependency(source, specifier) {
    const extension = extname(source)
    const isStyle = extension === '.scss' || extension === '.css'

    if (!specifier.startsWith('.') && !isStyle) return null

    const base = resolve(dirname(source), specifier)
    const candidates = isStyle ? styleCandidates(base) : scriptCandidates(base)

    return candidates.find(isFile) ?? null
}

function scriptCandidates(base) {
    if (extname(base)) return [base]

    return [
        base,
        `${base}.js`,
        `${base}.cjs`,
        `${base}.vue`,
        resolve(base, 'index.js'),
        resolve(base, 'index.cjs'),
    ]
}

function styleCandidates(base) {
    if (extname(base)) return [base, partialPath(base)]

    return [
        base,
        `${base}.scss`,
        `${base}.css`,
        partialPath(`${base}.scss`),
        resolve(base, '_index.scss'),
        resolve(base, 'index.scss'),
    ]
}

function partialPath(path) {
    return resolve(dirname(path), `_${path.slice(dirname(path).length + 1)}`)
}

function isFile(path) {
    return existsSync(path) && statSync(path).isFile()
}

function projectPath(path) {
    return relative(root, path).replaceAll('\\', '/')
}

function separator() {
    return process.platform === 'win32' ? '\\' : '/'
}
