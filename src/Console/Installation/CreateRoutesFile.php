<?php

namespace SleepingOwl\Admin\Console\Installation;

class CreateRoutesFile extends Installator
{
    public function showInfo()
    {
        $this->command->line('Creating routes file: <info>✔</info>');
    }

    /**
     * Install the components.
     *
     * @return void
     */
    public function install()
    {
        $file = $this->getFilePath();

        $contents = $this->command->files()->get(SLEEPINGOWL_STUB_PATH.'/routes.stub');
        $this->command->files()->put($file, $contents);
        $filePath = str_replace(base_path(), '', $file);
        $this->command->line("<info>Routes file is [{$filePath}]</info>");
    }

    /**
     * При возврате методом true данный компонент будет пропущен.
     *
     * @return bool
     */
    public function installed()
    {
        return file_exists($this->getFilePath());
    }

    /**
     * @return string
     */
    protected function getFilePath()
    {
        $bootstrapDirectory = $this->config->get('bootstrapDirectory', app_path('Admin'));

        return $bootstrapDirectory.'/routes.php';
    }
}
