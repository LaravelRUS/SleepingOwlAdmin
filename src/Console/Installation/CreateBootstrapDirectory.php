<?php

namespace SleepingOwl\Admin\Console\Installation;

class CreateBootstrapDirectory extends Installator
{
    public function showInfo()
    {
        $this->command->line('Creating bootstrap directory: <info>✔</info>');
    }

    /**
     * Install the components.
     *
     * @return void
     */
    public function install()
    {
        $directory = $this->getDirectory();

        $this->command->files()->makeDirectory($directory, 0755, true, true);

        $directoryPath = str_replace(base_path(), '', $directory);
        $this->command->line("<info>Admin bootstrap directory is [{$directoryPath}]</info>");
    }

    /**
     * При возврате методом true данный компонент будет пропущен.
     *
     * @return bool
     */
    public function installed()
    {
        return is_dir($this->getDirectory());
    }

    /**
     * @return string
     */
    protected function getDirectory()
    {
        return $this->config->get('bootstrapDirectory', app_path('Admin'));
    }
}
