let mix = require('laravel-mix');

mix
.less('resources/assets/less/common.less','public/packages/sleepingowl/default/css/admin-app.css',{})
.options({
    processCssUrls: false,
})
.js('resources/assets/js_owl/app.js',           'public/packages/sleepingowl/default/js/admin-app.js')
.js('resources/assets/js_owl/vue_init.js',      'public/packages/sleepingowl/default/js/vue.js')
.js('resources/assets/js_owl/modules_load.js',  'public/packages/sleepingowl/default/js/modules.js')

.copy('resources/assets/fonts',                 'public/packages/sleepingowl/default/fonts')
.copy('node_modules/bootstrap/fonts',           'public/packages/sleepingowl/default/fonts')
.copy('node_modules/font-awesome/fonts',        'public/packages/sleepingowl/default/fonts');

mix.webpackConfig({
    watchOptions: {
        aggregateTimeout: 2000,
        poll: 1000,
        ignored: /node_modules/
    },
    module:{
        rules:[
            {
                test: /\.(png|jpe?g|gif)$/,
                loaders: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: path => {
                                return 'images/[name].[ext]?[hash]';
                            },
                        publicPath: "",
                        }
                    },
                    'img-loader'
                ]
            },

            {
                test: /\.(woff2?|ttf|eot|svg|otf)$/,
                loader: 'file-loader',
                options: {
                    name: path => {
                        return '../fonts/[name].[ext]?[hash]';
                    },
                    publicPath: "../fonts",
                }
            }
        ]
    }
});
