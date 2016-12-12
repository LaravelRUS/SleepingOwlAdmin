<?php

namespace SleepingOwl\Admin\Console\Installation;

class PublishAssets extends Installator
{
    public function showInfo()
    {
        $this->command->line('Publish assets: <info>✔</info>');
    }

    /**
     * Install the components.
     *
     * @return void
     */
    public function install()
    {
        $this->command->call('vendor:publish', ['--tag' => 'assets', '--force']);
    }
}
