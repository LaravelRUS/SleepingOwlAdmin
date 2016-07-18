<?php

namespace SleepingOwl\Admin\Commands;

use Illuminate\Console\Command;

class SectionGenerate extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'sleepingowl:section:generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate the missing sections';

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function fire()
    {
        $provider = $this->laravel->getProvider(
            'App\Providers\AdminSectionsServiceProvider'
        );

        foreach ($provider->sections() as $model => $section) {
            $this->callSilent('sleepingowl:section:make', ['name' => $section, 'model' => $model]);
        }

        $this->info('Sections generated successfully!');
    }
}
