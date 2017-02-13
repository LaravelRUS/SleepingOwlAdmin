<?php
namespace SleepingOwl\Admin\Templates;

use KodiCMS\Assets\Assets as BaseAssets;
use KodiCMS\Assets\Html;
use SleepingOwl\Admin\Contracts\Template\Assets as AssetsContract;

class Assets extends BaseAssets implements AssetsContract
{

    /**
     * @var array
     */
    protected $globalVars = [];

    /**
     * Добавление глобальной переменной
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
     * Получение массива глобальных перменных
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