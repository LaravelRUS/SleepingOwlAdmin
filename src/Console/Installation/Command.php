<?php

namespace SleepingOwl\Admin\Console\Installation;

use Illuminate\Config\Repository;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Console\ConfirmableTrait;
use Illuminate\Console\Command as ConsoleCommand;

abstract class Command extends ConsoleCommand
{
    use ConfirmableTrait;

    /**
     * @var Filesystem
     */
    protected $files;

    /**
     * @var Repository
     */
    protected $config;

    /**
     * Execute the console command.
     *
     * @param Filesystem $files
     */
    public function fire(Filesystem $files)
    {
        if (! defined('SLEEPINGOWL_STUB_PATH')) {
            define('SLEEPINGOWL_STUB_PATH', __DIR__.'/stubs');
        }

        if (! $this->confirmToProceed('SleepingOwl Admin')) {
            return;
        }

        $this->call('vendor:publish', ['--tag' => 'config']);
        $this->config = new Repository($this->laravel['config']->get('sleeping_owl'));

        $this->files = $files;

        $this->runInstaller();
    }

    abstract protected function runInstaller();

    /**
     * @return Filesystem
     */
    public function files()
    {
        return $this->files;
    }
}
