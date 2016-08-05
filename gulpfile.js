var elixir = require('laravel-elixir'),
    path = require('path');

require('laravel-elixir-vue');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Less
 | file for our application, as well as publishing vendor resources.
 |
 */


elixir(function(mix) {
	mix
		.less('common.less', 'public/default/css/admin-app.css')
		.webpack('app.js', 'public/default/js/admin-app.js', false, {
            resolve: {
                // add alias for application code directory
                alias: {
                    jquery: path.resolve(__dirname, './node_modules/jquery/dist/jquery'),
                    moment: path.resolve(__dirname, './node_modules/moment/moment')
                }
            }
        })
		.copy('node_modules/bootstrap/fonts', 'public/default/fonts')
		.copy('node_modules/font-awesome/fonts', 'public/default/fonts');
});
