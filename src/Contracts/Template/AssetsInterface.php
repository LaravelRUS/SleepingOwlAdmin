<?php

namespace SleepingOwl\Admin\Contracts\Template;

use KodiCMS\Assets\Contracts\AssetsInterface as KodiAssetsInterface;

interface AssetsInterface extends KodiAssetsInterface
{
    /**
     * @param bool|string $handle
     * @param string $src
     * @param array|string $dependency
     * @param bool $footer
     * @param array $attributes
     * @return \KodiCMS\Assets\Contracts\AssetElementInterface
     */
    public function addJs($handle = false, $src = null, $dependency = null, $footer = true, array $attributes = []);

    /**
     * Добавление глобальной переменной.
     *
     * @param  string  $key
     * @param  mixed  $value
     * @return self
     */
    public function putGlobalVar($key, $value);

    /**
     * Получение массива глобальных
     * перменных
     * .
     *
     * @return array
     */
    public function globalVars();

    /**
     * @return string
     */
    public function renderGlobalVars();
}
