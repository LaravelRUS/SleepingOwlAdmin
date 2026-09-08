<?php

namespace SleepingOwl\Admin\Console\Commands;

use Illuminate\Console\Command;
use InvalidArgumentException;
use RuntimeException;
use SleepingOwl\Admin\Console\Scaffolding\ExtensionScaffold;

final class ExtensionMake extends Command
{
    protected $signature = 'sleepingowl:extension:make
        {type : form-element, widget, policy, module-provider, vue-island or theme}
        {name : Class or component name}
        {--force : Overwrite existing files}';

    protected $description = 'Create a SleepingOwl extension from a maintained stub';

    public function handle(ExtensionScaffold $scaffold): int
    {
        try {
            $paths = $scaffold->generate(
                (string) $this->argument('type'),
                (string) $this->argument('name'),
                $this->laravel->getNamespace(),
                app_path(),
                resource_path(),
                (bool) $this->option('force')
            );
        } catch (InvalidArgumentException|RuntimeException $exception) {
            $this->components->error($exception->getMessage());

            return self::FAILURE;
        }

        foreach ($paths as $path) {
            $this->components->info("Created [{$path}]");
        }

        return self::SUCCESS;
    }
}
