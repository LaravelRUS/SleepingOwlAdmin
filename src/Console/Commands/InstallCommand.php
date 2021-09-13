<?php

namespace SleepingOwl\Admin\Console\Commands;

use SleepingOwl\Admin\Console\Installation;
use SleepingOwl\Admin\Contracts\Console\InstallatorInterface as Installator;

class InstallCommand extends Installation\Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sleepingowl:install
                {--force : Force SleepingOwl to install even it has been already installed}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Install the SleepingOwl Admin package';

    protected function runInstaller()
    {
        collect([
            Installation\PublishAssets::class,
            Installation\CreateBootstrapDirectory::class,
            Installation\CreateBootstrapFile::class,
            Installation\CreateNavigationFile::class,
            Installation\CreateRoutesFile::class,
            Installation\CreateSectionServiceProvider::class,
            Installation\CreatePublicDirectory::class,
        ])->map(function ($installer) {
            return new $installer($this, $this->config);
        })->filter(function (Installator $installer) {
            return $this->option('force') ? true : ! $installer->installed();
        })->each(function (Installator $installer) {
            $installer->install();
            $installer->showInfo();
        });

        $this->comment('SleepingOwl Framework successfully installed.');
    }
}
