<?php namespace SleepingOwl\Admin\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\App;
use Symfony\Component\Console\Input\InputOption;

class InstallCommand extends Command
{

	/**
	 * The console command name.
	 * @var string
	 */
	protected $name = 'admin:install';
	/**
	 * The console command description.
	 * @var string
	 */
	protected $description = 'Install the admin package';

	/**
	 * Execute the console command.
	 * @return void
	 */
	public function fire()
	{
		$title = $this->option('title');

		$this->call('vendor:publish', ['--provider' => 'SleepingOwl\Admin\AdminServiceProvider']);

		$this->publishDB();
		$this->publishConfig($title);

		$this->createBootstrapDirectory();
		$this->createMenuFile();
		$this->createBootstrapFile();
		$this->createRoutesFile();
		$this->createDummyUserFile();

		$this->createPublicDefaultStructure();
	}

	/**
	 * Migrate database and default seed
	 */
	protected function publishDB()
	{
		$this->call('migrate');

		$this->call('db:seed', [
			'--class' => 'SleepingOwl\\AdminAuth\\Database\\Seeders\\AdministratorsTableSeeder'
		]);
	}

	/**
	 * Create bootstrap directory
	 */
	protected function createBootstrapDirectory()
	{
		$directory = config('admin.bootstrapDirectory');

		if ( ! is_dir($directory))
		{
			$this->laravel['files']->makeDirectory($directory, 0755, true, true);
			$this->line('<info>Admin bootstrap directory was created:</info> ' . str_replace(base_path(), '', $directory));
		}
	}

	/**
	 * Create default menu file
	 */
	protected function createMenuFile()
	{
		$file = config('admin.bootstrapDirectory') . '/menu.php';
		if ( ! file_exists($file))
		{
			$contents = $this->laravel['files']->get(__DIR__ . '/stubs/menu.stub');
			$this->laravel['files']->put($file, $contents);
			$this->line('<info>Menu file was created:</info> ' . str_replace(base_path(), '', $file));
		}
	}

	/**
	 * Create default bootstrap file
	 */
	protected function createBootstrapFile()
	{
		$file = config('admin.bootstrapDirectory') . '/bootstrap.php';
		if ( ! file_exists($file))
		{
			$contents = $this->laravel['files']->get(__DIR__ . '/stubs/bootstrap.stub');
			$this->laravel['files']->put($file, $contents);
			$this->line('<info>Bootstrap file was created:</info> ' . str_replace(base_path(), '', $file));
		}
	}

	/**
	 * Create default routes file
	 */
	protected function createRoutesFile()
	{
		$file = config('admin.bootstrapDirectory') . '/routes.php';
		if ( ! file_exists($file))
		{
			$contents = $this->laravel['files']->get(__DIR__ . '/stubs/routes.stub');
			$this->laravel['files']->put($file, $contents);
			$this->line('<info>Bootstrap file was created:</info> ' . str_replace(base_path(), '', $file));
		}
	}

	/**
	 * Create dummy user file
	 */
	protected function createDummyUserFile()
	{
		$file = config('admin.bootstrapDirectory') . '/User.php';
		if ( ! file_exists($file))
		{
			$contents = $this->laravel['files']->get(__DIR__ . '/stubs/User.stub');
			$this->laravel['files']->put($file, $contents);
			$this->line('<info>Dummy user file was created:</info> ' . str_replace(base_path(), '', $file));
		}
	}

	/**
	 * Create public default structure
	 */
	protected function createPublicDefaultStructure()
	{
		$uploadsDirectory = public_path('images/uploads');
		if ( ! is_dir($uploadsDirectory))
		{
			$this->laravel['files']->makeDirectory($uploadsDirectory, 0755, true, true);
		}
	}

	/**
	 * Publish package config
	 * @param string|null $title
	 */
	protected function publishConfig($title = null)
	{
		$file = config_path('admin.php');
		if ( ! is_null($title))
		{
			$contents = $this->laravel['files']->get($file);
			$contents = str_replace('Sleeping Owl administrator', $title, $contents);
			$this->laravel['files']->put($file, $contents);
		}
	}

	/**
	 * Get the console command options.
	 * @return array
	 */
	protected function getOptions()
	{
		return [
			[
				'title',
				null,
				InputOption::VALUE_REQUIRED,
				'Title for admin module.'
			],
		];
	}

}
