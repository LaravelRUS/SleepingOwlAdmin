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
			'select2/js/select2.full.js',
			'datetimepicker/js/jquery.datetimepicker.js',
			'moment/js/moment.min.js',
			'bootbox.js/js/bootbox.js'
		], 'public/default/js/libraries.js', 'public/default/libs');

	/**************************************************************
	 * Admin
	 **************************************************************/
	mix
		.scripts([
			'columns/filter/base.js',
			'columns/filter/range.js',
			'columns/filter/select.js',
			'columns/filter/text.js',
			'columns/checkbox.js',
			'columns/control.js',
			'columns/image.js',
			'form/datetime.js',
			'form/select.js',
			'form/image/init.js',
			'form/image/initMultiple.js',
			'datatables.js',
			'admin-default.js',
			'sb-admin-2.js'
		], 'public/default/js/admin-default.js');
});
