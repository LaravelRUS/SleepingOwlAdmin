let mix = require('laravel-mix');

mix.setPublicPath('./public/');

mix.webpackConfig({
    stats: {
        children: true,
    },
})


mix.sass('resources/assets/scss/app.scss', 'default/css/admin-app.css')
  .js('resources/assets/js_owl/vue_init.js', 'default/js/vue.js')
  .js('resources/assets/js_owl/app.js', 'default/js/admin-app.js')
  .js('resources/assets/js_owl/app-dev.js', 'default/js/admin-app-dev.js')
  .js('resources/assets/js_owl/modules_load.js', 'default/js/modules.js')
  .options({
    processCssUrls: true,
    resourceRoot: '../',
    imgLoaderOptions: {
      enabled: false,
    },
  })


/**
 * Template BS5
 */

mix.sass('resources/assets/scss/app_bs5.scss', 'bs5/css/admin-app.css')
    .js('resources/assets/js_owl/app_bs5.js', 'bs5/js/admin-app.js')
    .js('resources/assets/js_owl/app_bs5_dev.js', 'bs5/js/admin-app-dev.js')
    .options({
        processCssUrls: true,
        resourceRoot: '../',
        imgLoaderOptions: {
            enabled: false,
        },
    })


if (mix.inProduction()) {
  mix.version()
}
