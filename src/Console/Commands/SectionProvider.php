<?php

namespace SleepingOwl\Admin\Console\Commands;

use Illuminate\Config\Repository;
use Illuminate\Console\Command;
use SleepingOwl\Admin\Console\Installation\CreateSectionServiceProvider;

class SectionProvider extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'sleepingowl:section:provider';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create [AdminSectionsServiceProvider] class';

    /**
     * @param  Repository  $files
     *
     * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException
     */
    public function fire(Repository $files)
    {
        $installer = new CreateSectionServiceProvider($this, $files);
        if ($installer->installed()) {
            $this->line('File <info>AdminSectionsServiceProvider</info> exists');

            return;
        }

        $installer->install();
    }

    /**
     * @param  Repository  $files
     *
     * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException
     */
    public function handle(Repository $files)
    {
        $installer = new CreateSectionServiceProvider($this, $files);
        if ($installer->installed()) {
            $this->line('File <info>AdminSectionsServiceProvider</info> exists');

            return;
        }

        $installer->install();
    }
}
