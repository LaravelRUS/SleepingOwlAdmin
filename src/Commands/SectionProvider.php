<?php

namespace SleepingOwl\Admin\Commands;

use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;

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
        $file = app_path('Providers/AdminSectionsServiceProvider.php');
        $ns = rtrim($this->getLaravel()->getNamespace(), '\\');

        if (! file_exists($file)) {
            $contents = str_replace(
                '__NAMESPACE__',
                $ns,
                $files->get(__DIR__.'/stubs/provider.stub')
            );

            $files->put($file, $contents);

            $this->line('<info>AdminSectionsServiceProvider file was created:</info> '.str_replace(base_path(), '', $file));

            return;
        }

        $this->line('File <info>AdminSectionsServiceProvider</info> exists');
    }
}
