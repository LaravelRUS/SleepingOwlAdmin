<?php

namespace SleepingOwl\Admin\Contracts\Console;

interface InstallatorInterface
{
    /**
     * Вывод информации о текущей конфигурации.
     *
     * @return void
     */
    public function showInfo();

    /**
     * Установка компонентов текущей конфигурации.
     *
     * @return void
     */
    public function install();

    /**
     * При возврате методом true данный компонент будет пропущен.
     *
     * @return bool
     */
    public function installed();
}
