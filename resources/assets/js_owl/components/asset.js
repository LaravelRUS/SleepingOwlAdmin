const {
    createRuntimeAssetLoader,
} = require('../../../frontend/core/assets/runtime-assets')

module.exports = createRuntimeAssetLoader({
    createImage: () => new Image(),
    document,
    log: (message) => Admin.log(message, 'Asset'),
})
