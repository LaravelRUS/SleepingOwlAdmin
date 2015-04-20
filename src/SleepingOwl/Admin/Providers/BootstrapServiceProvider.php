<?php namespace SleepingOwl\Admin\Providers;

use Illuminate\Support\ServiceProvider;
use Symfony\Component\Finder\Finder;

class BootstrapServiceProvider extends ServiceProvider
{

	const BOOTSRAP_FILE = 'bootstrap.php';

	protected $directory;

	public function register()
	{
		$this->directory = config('admin.bootstrapDirectory');
		if ( ! is_dir($this->directory))
		{
			return;
		}
		$files = $this->getAllFiles();
		foreach ($files as $file)
		{
			require $file;
		}
	}

	protected function getAllFiles()
	{
		$files = Finder::create()->files()->name('/^.+\.php$/')->notName('routes.php')->in($this->directory);
		$files->sort(function ($a)
		{
			return $a->getFilename() !== static::BOOTSRAP_FILE;
		});
		return $files;
	}

}