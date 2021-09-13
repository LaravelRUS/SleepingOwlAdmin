<?php

namespace SleepingOwl\Admin\Console\Commands;

use Illuminate\Console\Command;
use SleepingOwl\Admin\Contracts\AdminInterface;

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
     * @param  AdminInterface  $admin
     * @return void
     */
    public function fire(AdminInterface $admin)
    {
        foreach ($admin->getMissedSections() as $model => $section) {
            $this->callSilent('sleepingowl:section:make', ['name' => $section, 'model' => $model]);
        }

        $this->info('Sections generated successfully!');
    }

    /**
     * Execute the console command.
     *
     * @param  AdminInterface  $admin
     * @return void
     */
    public function handle(AdminInterface $admin)
    {
        foreach ($admin->getMissedSections() as $model => $section) {
            $this->callSilent('sleepingowl:section:make', ['name' => $section, 'model' => $model]);
        }

        $this->info('Sections generated successfully!');
    }
}
