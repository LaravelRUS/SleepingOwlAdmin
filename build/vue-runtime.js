const { resolve } = require('node:path')

const runtimeFiles = Object.freeze({
    development: 'vue.cjs.js',
    production: 'vue.cjs.prod.js',
})

function resolveVueRuntime(root, profile) {
    const file = runtimeFiles[profile]

    if (!file) {
        throw new Error(`Unsupported Vue asset profile [${profile}].`)
    }

    return resolve(root, 'node_modules', '@vue', 'compat', 'dist', file)
}

module.exports = {
    resolveVueRuntime,
    runtimeFiles,
}
