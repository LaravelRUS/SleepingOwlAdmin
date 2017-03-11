<?php

namespace SleepingOwl\Admin\Templates;

use KodiCMS\Assets\Html;
use KodiCMS\Assets\Assets as BaseAssets;
use KodiCMS\Assets\Contracts\AssetElementInterface;
use SleepingOwl\Admin\Contracts\Template\Assets as AssetsContract;

class Assets extends BaseAssets implements AssetsContract
{
    /**
     * @var array
     */
    protected $globalVars = [];

    /**
     * Gets or sets javascript assets.
     *
     * @param bool|string  $handle
     * @param string       $src        Asset source
     * @param array|string $dependency Dependencies
     * @param bool         $footer     Whether to show in header or footer
     *
     * @return AssetElementInterface Setting returns asset array, getting returns asset HTML
     */
    public function addJs($handle = false, $src = null, $dependency = null, $footer = true)
    {
        return parent::addJs($handle, $src, $dependency, $footer);
    }

    /**
     * Добавление глобальной переменной.
     *
     * @param string $key
     * @param mixed $value
     *
     * @return self
     */
    public function putGlobalVar($key, $value)
    {
        $this->globalVars[$key] = $value;

        return $this;
    }

    /**
     * Получение массива глобальных перменных.
     *
     * @return array
     */
    public function globalVars()
    {
        return $this->globalVars;
    }

    /**
     * @return string
     */
    public function render()
    {
        return $this->renderGlobalVars().PHP_EOL.parent::render();
    }

    /**
     * @return string
     */
    public function renderGlobalVars()
    {
        $json = json_encode($this->globalVars);

        return (new Html())->vars("{$this->namespace}.GlobalConfig = {$json};");
    }
}
