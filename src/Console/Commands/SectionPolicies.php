<?php

namespace SleepingOwl\Admin\Console\Commands;

use Illuminate\Console\Command;

class SectionPolicies extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'sleepingowl:section:policies';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate section policies';

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function fire()
    {
        $provider = $this->laravel->getProvider(
            $this->laravel->getNamespace().'Providers\\AdminSectionsServiceProvider'
        );

        if (! $provider) {
            $this->error('[App\Providers\AdminSectionsServiceProvider] not found');

            return;
        }

        foreach ($provider->policies() as $policy) {
            $this->callSilent('make:policy', ['name' => $policy]);
        }

        $this->info('Section policies generated successfully!');
    }
}
