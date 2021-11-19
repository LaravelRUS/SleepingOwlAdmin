let mix = require('laravel-mix');

mix.setPublicPath('./public/default/');


mix.sass('resources/assets/scss/app.scss', 'css/admin-app.css')
  .js('resources/assets/js_owl/vue_init.js', 'js/vue.js')
  .js('resources/assets/js_owl/app.js', 'js/admin-app.js')
  .js('resources/assets/js_owl/app-dev.js', 'js/admin-app-dev.js')
  .js('resources/assets/js_owl/modules_load.js', 'js/modules.js')
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
