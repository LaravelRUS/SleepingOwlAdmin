<?php

namespace SleepingOwl\Admin\Commands;

use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;
use Symfony\Component\Console\Input\InputOption;
use SleepingOwl\Admin\Providers\SleepingOwlServiceProvider;

class InstallCommand extends Command
{
    /**
     * The console command name.
     * @var string
     */
    protected $name = 'sleepingowl:install';

    /**
     * The console command description.
     * @var string
     */
    protected $description = 'Install the SleepingOwl Admin package';

    /**
     * @var Filesystem
     */
    protected $files;

    /**
     * Execute the console command.
     *
     * @param Filesystem $files
     */
    public function fire(Filesystem $files)
    {
        $this->files = $files;

        $title = $this->option('title');

        $this->call('vendor:publish', ['--provider' => SleepingOwlServiceProvider::class]);

        $this->publishConfig($title);

        $this->createBootstrapDirectory();
        $this->createNavigationFile();
        $this->createBootstrapFile();
        $this->createRoutesFile();
        $this->createPublicDefaultStructure();
    }

    /**
     * Create bootstrap directory.
     */
    protected function createBootstrapDirectory()
    {
        $directory = config('sleeping_owl.bootstrapDirectory');

        if (! is_dir($directory)) {
            $this->files->makeDirectory($directory, 0755, true, true);
            $this->line('<info>Admin bootstrap directory was created:</info> '.str_replace(base_path(), '', $directory));
        }
    }

    /**
     * Create default menu file.
     */
    protected function createNavigationFile()
    {
        $file = config('sleeping_owl.bootstrapDirectory').'/navigation.php';

        if (! file_exists($file)) {
            $contents = $this->files->get(__DIR__.'/stubs/navigation.stub');
            $this->files->put($file, $contents);
            $this->line('<info>Menu file was created:</info> '.str_replace(base_path(), '', $file));
        }
    }

    /**
     * Create default bootstrap file.
     */
    protected function createBootstrapFile()
    {
        $file = config('sleeping_owl.bootstrapDirectory').'/bootstrap.php';
        if (! file_exists($file)) {
            $contents = $this->files->get(__DIR__.'/stubs/bootstrap.stub');
            $this->files->put($file, $contents);
            $this->line('<info>Bootstrap file was created:</info> '.str_replace(base_path(), '', $file));
        }
    }

    /**
     * Create default routes file.
     */
    protected function createRoutesFile()
    {
        $file = config('sleeping_owl.bootstrapDirectory').'/routes.php';
        if (! file_exists($file)) {
            $contents = $this->files->get(__DIR__.'/stubs/routes.stub');
            $this->files->put($file, $contents);
            $this->line('<info>Bootstrap file was created:</info> '.str_replace(base_path(), '', $file));
        }
    }

    /**
     * Create public default structure.
     */
    protected function createPublicDefaultStructure()
    {
        $uploadsDirectory = public_path('images/uploads');
        if (! is_dir($uploadsDirectory)) {
            $this->files->makeDirectory($uploadsDirectory, 0755, true, true);
        }
    }

    /**
     * Publish package config.
     *
     * @param string|null $title
     */
    protected function publishConfig($title = null)
    {
        $file = config_path('sleeping_owl.php');

        if (! is_null($title)) {
            $contents = $this->files->get($file);
            $contents = str_replace('Sleeping Owl administrator', $title, $contents);
            $this->files->put($file, $contents);
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
                'Title for admin module.',
            ],
        ];
    }
}
