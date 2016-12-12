<?php

namespace SleepingOwl\Admin\Console\Installation;

class CreateNavigationFile extends Installator
{
    public function showInfo()
    {
        $this->command->line('Creating navigation file: <info>✔</info>');
    }

    /**
     * Install the components.
     *
     * @return void
     */
    public function install()
    {
        $file = $this->getFilePath();

        $contents = $this->command->files()->get(SLEEPINGOWL_STUB_PATH.'/navigation.stub');
        $this->command->files()->put($file, $contents);
        $filePath = str_replace(base_path(), '', $file);
        $this->command->line("<info>Navigation file is [{$filePath}]</info>");
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

        return $bootstrapDirectory.'/navigation.php';
    }
}
