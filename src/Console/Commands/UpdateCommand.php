<?php

namespace SleepingOwl\Admin\Console\Commands;

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
     * @var string
     */
    protected $description = 'Update the SleepingOwl Admin package';

    protected function runInstaller()
    {
        $this->call('vendor:publish', ['--tag' => 'assets', '--force']);
        $this->callSilent('sleepingowl:ide:generate');

        $this->comment('SleepingOwl Framework successfully updated.');
    }
}
