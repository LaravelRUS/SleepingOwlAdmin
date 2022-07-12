<?php

namespace SleepingOwl\Admin\Contracts\Template;

use KodiCMS\Assets\Contracts\AssetsInterface as KodiAssetsInterface;

interface AssetsInterface extends KodiAssetsInterface
{
    /**
     * Добавление глобальной переменной.
     *
     * @param string $key
     * @param  mixed  $value
     * @return self
     */
    public function putGlobalVar(string $key, $value): AssetsInterface;

    /**
     * Получение массива глобальных переменных.
     *
     * @return array
     */
    public function globalVars(): array;

    /**
     * @return string
     */
    public function renderGlobalVars(): string;
}
