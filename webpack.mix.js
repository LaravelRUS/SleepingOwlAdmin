let mix = require('laravel-mix');

mix.setPublicPath('./public/packages/sleepingowl/default/');
mix
  .less('resources/assets/less/common.less', 'css/admin-app.css')

mix.js('resources/assets/js_owl/app.js', 'js/admin-app.js');
mix.js('resources/assets/js_owl/vue_init.js', 'js/vue.js');
mix.js('resources/assets/js_owl/modules_load.js', 'js/modules.js')
.options({
    processCssUrls: true,
    resourceRoot: '../',
    imgLoaderOptions: {
      enabled: false,
    }
});

