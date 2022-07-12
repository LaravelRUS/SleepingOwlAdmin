<?php

namespace SleepingOwl\Admin\Console\Installation;

class CreateSectionServiceProvider extends Installator
{
    /**
     * Вывод информации о текущей конфигурации.
     *
     * @return void
     */
    public function showInfo()
    {
        $this->command->line('Creating [AdminSectionsServiceProvider.php] file: <info>✔</info>');
    }

    public function install()
    {
        $file = $this->getFilePath();
        $ns = rtrim($this->command->getLaravel()->getNamespace(), '\\');

        $contents = str_replace(
            '__NAMESPACE__',
            $ns,
            $this->command->files()->get(SLEEPINGOWL_STUB_PATH.'/provider.stub')
        );

        $this->command->files()->put($file, $contents);
    }

    /**
     * При возврате методом true данный компонент будет пропущен.
     *
     * @return bool
     */
    public function installed(): bool
    {
        return file_exists($this->getFilePath());
    }

    /**
     * @return string
     */
    protected function getFilePath(): string
    {
        return app_path('Providers/AdminSectionsServiceProvider.php');
    }
}
