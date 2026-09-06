const mix = require('laravel-mix')

mix.webpackConfig({
    externals: {
        vue: ['Admin', 'Vue', 'runtime'],
    },
})

mix.js('resources/js/admin.js', 'public/js/admin.js').vue({ version: 3 })
