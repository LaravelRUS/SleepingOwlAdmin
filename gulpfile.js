var elixir = require('laravel-elixir');
elixir.extend('sourcemaps', false);

process.env.DISABLE_NOTIFIER = true;

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
		.less('common.less', 'public/default/css');

	/**************************************************************
	 * Libraries
	 **************************************************************/
	mix
		.scripts([
			'jquery/js/jquery.min.js',
			'bootstrap/js/bootstrap.js',
			'noty/js/jquery.noty.packaged.js',
			'bootbox.js/js/bootbox.js',
			'jquery-colorbox/js/jquery.colorbox-min.js',
			'moment/js/moment-with-locales.min.js',
			'underscore/js/underscore.js',
			'x-editable/js/bootstrap-editable.min.js',
			'ekko-lightbox/js/ekko-lightbox.min.js',
			'../../../resources/assets/js/core.js'
		], 'public/default/js/libraries.js', 'public/default/libs');

	/**************************************************************
	 * Admin
	 **************************************************************/
	mix
		.scripts([
			'column/checkbox.js',
			'column/control.js',
			'column/image.js',
			'form/datetime.js',
			'form/select.js',
			'form/image/init.js',
			'form/image/initMultiple.js',
			'init.js'
		], 'public/default/js/admin-default.js');

	mix
		.scripts([
			'libs/datatables/dataTables.bootstrap.js',
			'libs/datatables/datatables.js'
		], 'public/default/js/datatables.min.js');
});
