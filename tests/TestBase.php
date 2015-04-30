<?php 

abstract class TestBase extends Orchestra\Testbench\TestCase
{

	protected function getPackageProviders($app)
	{
		return ['SleepingOwl\Admin\AdminServiceProvider'];
	}

	protected function getPackageAliases($app)
	{
		return [
			'Admin'         => 'SleepingOwl\Admin\Admin',
			'AdminAuth'     => 'SleepingOwl\AdminAuth\Facades\AdminAuth',
			'Column'        => 'SleepingOwl\Admin\Columns\Column',
			'Filter'        => 'SleepingOwl\Admin\Filter\Filter',
			'AdminDisplay'  => 'SleepingOwl\Admin\Display\AdminDisplay',
			'AdminForm'     => 'SleepingOwl\Admin\Form\AdminForm',
			'AdminTemplate' => 'SleepingOwl\Admin\Templates\Facade\AdminTemplate',
			'FormItem'      => 'SleepingOwl\Admin\FormItems\FormItem',
		];
	}

	public function setUp()
	{
		parent::setUp();

		$this->artisan('migrate', [
			'--database' => 'testbench',
			'--realpath' => realpath(__DIR__.'/../src/migrations'),
		]);
		$this->artisan('migrate', [
			'--database' => 'testbench',
			'--realpath' => realpath(__DIR__.'/migrations'),
		]);
		$administrator = \SleepingOwl\AdminAuth\Entities\Administrator::create([
			'username' => 'admin',
			'password' => 'admin',
			'name' => 'admin',
		]);
		AdminAuth::login($administrator);
	}

	protected function getEnvironmentSetUp($app)
	{
		$app['config']->set('database.default', 'testbench');
		$app['config']->set('database.connections.testbench', [
			'driver'   => 'sqlite',
			'database' => ':memory:',
			'prefix'   => '',
		]);
	}

} 