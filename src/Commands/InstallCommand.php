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

        $this->createServiceProvider();
        $this->createPublicDefaultStructure();
    }

    protected function createServiceProvider()
    {
        $this->call('sleepingowl:section:provider');
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
            ['title', null, InputOption::VALUE_REQUIRED, 'Title for admin module.'],
        ];
    }
}
