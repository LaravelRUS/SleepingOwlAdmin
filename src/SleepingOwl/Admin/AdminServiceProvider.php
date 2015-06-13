<?php namespace SleepingOwl\Admin;

use Illuminate\Support\ServiceProvider;

class AdminServiceProvider extends ServiceProvider
{

	/**
	 * Providers to register
	 */
	protected $providers = [
		'SleepingOwl\AdminAuth\AdminAuthServiceProvider',
		'SleepingOwl\Admin\Providers\DisplayServiceProvider',
		'SleepingOwl\Admin\Providers\ColumnServiceProvider',
		'SleepingOwl\Admin\Providers\ColumnFilterServiceProvider',
		'SleepingOwl\Admin\Providers\FormServiceProvider',
		'SleepingOwl\Admin\Providers\FormItemServiceProvider',
		'SleepingOwl\Admin\Providers\FilterServiceProvider',
		'SleepingOwl\Admin\Providers\BootstrapServiceProvider',
		'SleepingOwl\Admin\Providers\RouteServiceProvider',
	];

	/**
	 * Commands to register
	 */
	protected $commands = [
		'AdministratorsCommand',
		'InstallCommand',
		'ModelCommand'
	];

	/**
	 *
	 */
	public function register()
	{
		$this->registerCommands();
	}

	/**
	 *
	 */
	public function boot()
	{
		$this->loadViewsFrom(__DIR__ . '/../../views', 'admin');
		$this->loadTranslationsFrom(__DIR__ . '/../../lang', 'admin');
		$this->mergeConfigFrom(__DIR__ . '/../../config/config.php', 'admin');

		$this->publishes([
			__DIR__ . '/../../config/config.php' => config_path('admin.php'),
		], 'config');

		$this->publishes([
			__DIR__ . '/../../migrations/' => base_path('/database/migrations'),
		], 'migrations');

		$this->publishes([
			__DIR__ . '/../../../public/' => public_path('packages/sleeping-owl/admin/'),
		], 'assets');

		app('SleepingOwl\Admin\Helpers\StartSession')->run();

		Admin::instance();
		$this->registerTemplate();
		$this->registerProviders();
		$this->initializeTemplate();
	}

	/**
	 * @return array
	 */
	public function provides()
	{
		return ['admin'];
	}

	/**
	 * Bind current template
	 */
	protected function registerTemplate()
	{
		app()->bind('adminTemplate', function ()
		{
			return Admin::instance()->template();
		});
	}

	/**
	 * Initialize template
	 */
	protected function initializeTemplate()
	{
		app('adminTemplate');
	}

	/**
	 * Register providers
	 */
	protected function registerProviders()
	{
		foreach ($this->providers as $providerClass)
		{
			$provider = app($providerClass, [app()]);
			$provider->register();
		}
	}

	/**
	 * Register commands
	 */
	protected function registerCommands()
	{
		foreach ($this->commands as $command)
		{
			$this->commands('SleepingOwl\Admin\Commands\\' . $command);
		}
	}

}