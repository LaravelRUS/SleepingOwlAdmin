<?php namespace SleepingOwl\Admin\Commands;

use Config;
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

		$this->call('vendor:publish');

		$this->publishDB();

		$this->publishImagecacheConfig();
		$this->publishSelfConfig($title);

		$this->createBootstrapDirectory();
		$this->createMenuFile();
		$this->createBootstrapFile();
		$this->createDummyUserFile();

		$this->createPublicDefaultStructure();
	}

	/**
	 *
	 */
	protected function publishDB()
	{
		$this->call('migrate');

		$this->call('db:seed', [
			'--class' => 'SleepingOwl\\AdminAuth\\Database\\Seeders\\AdministratorsTableSeeder'
		]);
	}

	/**
	 *
	 */
	protected function createBootstrapDirectory()
	{
		$directory = Config::get('admin.bootstrapDirectory');

		if ( ! is_dir($directory))
		{
			$this->laravel['files']->makeDirectory($directory, 0755, true, true);
			$this->line('<info>Admin bootstrap directory was created:</info> ' . str_replace(base_path(), '', $directory));
		}
	}

	/**
	 *
	 */
	protected function createMenuFile()
	{
		$file = Config::get('admin.bootstrapDirectory') . '/menu.php';
		if ( ! file_exists($file))
		{
			$contents = $this->laravel['files']->get(__DIR__ . '/stubs/menu.stub');
			$this->laravel['files']->put($file, $contents);
			$this->line('<info>Menu file was created:</info> ' . str_replace(base_path(), '', $file));
		}
	}

	/**
	 *
	 */
	protected function createBootstrapFile()
	{
		$file = Config::get('admin.bootstrapDirectory') . '/bootstrap.php';
		if ( ! file_exists($file))
		{
			$contents = $this->laravel['files']->get(__DIR__ . '/stubs/bootstrap.stub');
			$this->laravel['files']->put($file, $contents);
			$this->line('<info>Bootstrap file was created:</info> ' . str_replace(base_path(), '', $file));
		}
	}

	/**
	 *
	 */
	protected function createDummyUserFile()
	{
		$file = Config::get('admin.bootstrapDirectory') . '/User.php';
		if ( ! file_exists($file))
		{
			$contents = $this->laravel['files']->get(__DIR__ . '/stubs/User.stub');
			$this->laravel['files']->put($file, $contents);
			$this->line('<info>Dummy user file was created:</info> ' . str_replace(base_path(), '', $file));
		}
	}

	/**
	 *
	 */
	protected function publishImagecacheConfig()
	{
		$file = config_path('imagecache.php');
		if ( ! file_exists($file))
		{
			$contents = $this->laravel['files']->get($file);
			$contents = str_replace('\'route\' => null,', '\'route\' => \'img/cache\',', $contents);
			$this->laravel['files']->put($file, $contents);
		}
	}

	/**
	 *
	 */
	protected function createPublicDefaultStructure()
	{
		$uploadsDirectory = public_path('images/uploads');
		if ( ! is_dir($uploadsDirectory))
		{
			$this->laravel['files']->makeDirectory($uploadsDirectory, 0755, true, true);
		}
		$filesDirectory = public_path('files');
		if ( ! is_dir($filesDirectory))
		{
			$this->laravel['files']->makeDirectory($filesDirectory, 0755, true, true);
		}
	}

	/**
	 * @param string|null $title
	 */
	protected function publishSelfConfig($title = null)
	{
		$file = config_path('sleeping_owl_admin.php');
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
