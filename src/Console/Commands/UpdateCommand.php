<?php

namespace SleepingOwl\Admin\Console\Commands;

use Illuminate\Filesystem\Filesystem;
use SleepingOwl\Admin\Console\Installation;

class UpdateCommand extends Installation\Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sleepingowl:update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update the SleepingOwl Admin package';

    /**
     * Execute the console command.
     *
     * @param  Filesystem  $files
     */
    public function fire(Filesystem $files)
    {
        $this->runInstaller();
    }

    /**
     * @param  Filesystem  $files
     */
    public function handle(Filesystem $files)
    {
        $this->runInstaller();
    }

    protected function runInstaller()
    {
        $this->call('vendor:publish', ['--tag' => 'assets', '--force' => true]);
        $this->callSilent('sleepingowl:ide:generate');

        $this->comment('SleepingOwl Framework successfully updated.');
    }
}
