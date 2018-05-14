let mix = require('laravel-mix');

mix
  .less('resources/assets/less/common.less', 'public/default/css/admin-app.css')
  .options({
    processCssUrls: true,
    resourceRoot: '../',
    imgLoaderOptions: {
      enabled: false,
    },
    publicPath: 'public/default'
  });

mix.js('resources/assets/js_owl/app.js', 'public/default/js/admin-app.js');
mix.js('resources/assets/js_owl/vue_init.js', 'public/default/js/vue.js');
mix.js('resources/assets/js_owl/modules_load.js', 'public/default/js/modules.js');
