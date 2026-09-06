const { resolve } = require('node:path')

const runtimeFiles = Object.freeze({
    development: 'vue.runtime.esm-bundler.js',
    production: 'vue.runtime.esm-bundler.js',
})

function resolveVueRuntime(root, profile) {
    const file = runtimeFiles[profile]

    if (!file) {
        throw new Error(`Unsupported Vue asset profile [${profile}].`)
    }

    return resolve(root, 'node_modules', 'vue', 'dist', file)
}

module.exports = {
    resolveVueRuntime,
    runtimeFiles,
}
