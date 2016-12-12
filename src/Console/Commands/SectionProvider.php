<?php

namespace SleepingOwl\Admin\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;
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
     * Execute the console command.
     *
     * @param Filesystem $files
     */
    public function fire(Filesystem $files)
    {
        $installer = new CreateSectionServiceProvider($this, $files);
        if ($installer->installed()) {
            $this->line('File <info>AdminSectionsServiceProvider</info> exists');

            return;
        }

        $installer->install();
    }
}
