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
        collect([
            Installation\PublishAssets::class,
        ])
            ->map(function ($installer) {
                return new $installer($this, $this->config);
            })
            ->filter(function ($installer) {
                return $this->option('force') ? true : ! $installer->installed();
            })->each(function ($installer) {
                $installer->install();
                $installer->showInfo();
            });

        $this->comment('SleepingOwl Framework successfully updated.');
    }
}
