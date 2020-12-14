<?php

namespace SleepingOwl\Admin\Console\Commands;

use Barryvdh\LaravelIdeHelper\Console\GeneratorCommand as IdeHelperGeneratorCommand;
use SleepingOwl\Admin\Console\Generator;

/**
 * A command to generate autocomplete information for your IDE.
 *
 * @author Aios Dave <aioslike@gmail.com>
 */
class GeneratorCommand extends IdeHelperGeneratorCommand
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'sleepingowl:ide:generate';

    /**
     * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException
     */
    public function handle()
    {
        if (file_exists(base_path().'/vendor/compiled.php') ||
            file_exists(base_path().'/bootstrap/cache/compiled.php') ||
            file_exists(base_path().'/storage/framework/compiled.php')) {
            $this->error(
                'Error generating IDE Helper: first delete your compiled file (php artisan clear-compiled)'
            );
        } else {
            $filename = (string) $this->argument('filename');
            // Format option was removed from Laravel IDE Helper
            // @see https://github.com/barryvdh/laravel-ide-helper/commit/ae5d7708b7503a6adc00389688bde3f92976dc93
            $format = 'php'; // (string) $this->option('format');

            // Strip the php extension
            if (substr($filename, -4, 4) == '.php') {
                $filename = substr($filename, 0, -4);
            }

            $filename = implode('.', [$filename, $format]);

            if ($this->option('memory')) {
                $this->useMemoryDriver();
            }

            $helpers = '';
            if ($this->option('helpers') || ($this->config->get('ide-helper.include_helpers'))) {
                foreach ($this->config->get('ide-helper.helper_files', []) as $helper) {
                    if (file_exists($helper)) {
                        $helpers .= str_replace(['<?php', '?>'], '', $this->files->get($helper));
                    }
                }
            } else {
                $helpers = '';
            }

            $generator = new Generator($this->config, $this->view, $this->getOutput(), $helpers);
            $content = $generator->generate($format);
            $written = (bool) $this->files->put($filename, $content);

            if (! $written) {
                $this->error("The helper file could not be created at $filename");
            } else {
                $this->info("A new helper file was written to $filename");
            }
        }
    }
}
