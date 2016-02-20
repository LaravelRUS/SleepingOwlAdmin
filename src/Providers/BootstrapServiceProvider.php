<?php

namespace SleepingOwl\Admin\Providers;

use Symfony\Component\Finder\Finder;
use Illuminate\Support\ServiceProvider;

class BootstrapServiceProvider extends ServiceProvider
{
    protected $directory;

    public function register()
    {
        $this->directory = config('sleeping_owl.bootstrapDirectory');

        if (! is_dir($this->directory)) {
            return;
        }

        $files = $this->getAllFiles();
        foreach ($files as $file) {
            require $file;
        }
    }

    /**
     * @return array
     */
    protected function getAllFiles()
    {
        $files = Finder::create()
            ->files()
            ->name('/^.+\.php$/')
            ->notName('routes.php')
            ->notName('navigation.php')
            ->in($this->directory);

        $files->sort(function ($a) {
            return $a->getFilename() != 'bootstrap.php';
        });

        return $files;
    }
}