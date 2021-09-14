<?php

namespace SleepingOwl\Admin\Templates;

use Illuminate\Support\Collection;
use KodiCMS\Assets\AssetElement;
use KodiCMS\Assets\Assets as BaseAssets;
use KodiCMS\Assets\Contracts\AssetElementInterface;
use KodiCMS\Assets\Html;
use SleepingOwl\Admin\Contracts\Template\AssetsInterface as AssetsContract;

class Assets extends BaseAssets implements AssetsContract
{
    /**
     * @var array
     */
    protected $globalVars = [];

    /**
     * Gets or sets javascript assets.
     *
     * @param  bool|string  $handle
     * @param  string  $src  Asset source
     * @param  array|string  $dependency  Dependencies
     * @param  bool  $footer  Whether to show in header or footer
     * @return AssetElementInterface Setting returns asset array, getting returns asset HTML
     */
    public function addJs($handle = false, $src = null, $dependency = null, $footer = true)
    {
        return parent::addJs($handle, $src, $dependency, $footer);
    }

    /**
     * @param  AssetElementInterface[]  $assets
     * @return array|bool|static
     */
    protected function sort($assets)
    {
        $mainAssets = collect($assets)->filter(function (AssetElement $item) {
            return ! array_filter($item->getDependency());
        });

        $depAssets = collect($assets)->filter(function (AssetElement $item) {
            return array_filter($item->getDependency());
        });

        foreach ($depAssets as $key => $asset) {
            $mainAssets = $this->insertOn($asset, $mainAssets, collect($assets));
        }

        if ($mainAssets->count()) {
            return $mainAssets;
        }

        return parent::sort($assets);
    }

    /**
     * @param  AssetElement  $asset
     * @param  Collection  $mainAssets
     * @param  Collection  $assets
     * @return Collection
     */
    protected function insertOn(AssetElement $asset, Collection &$mainAssets, Collection $assets)
    {
        $dependency = collect($asset->getDependency());
        $checkedDep = null;
        $hasNotDep = null;

        foreach ($dependency as $dep) {
            if (! $mainAssets->has($dep)) {
                $hasNotDep = $dep;
                break;
            }

            $checkedDep = $dep;
        }

        if ($hasNotDep && $assets->get($hasNotDep)) {
            return $this->insertOn($assets->get($hasNotDep), $mainAssets, $assets);
        }

        if ($checkedDep) {
            return $mainAssets = $this->insertAfter($checkedDep, $mainAssets, $asset->getHandle(), $asset);
        }

        return $mainAssets;
    }

    /**
     * Inserts a new key/value before the key in the array.
     *
     * @param $key
     *   The key to insert before.
     * @param $array
     *   An array to insert in to.
     * @param $new_key
     *   The key to insert.
     * @param $new_value
     *   An value to insert.
     * @return array|bool The new array if the key exists, FALSE otherwise.
     *
     * @see array_insert_after()
     */
    protected function insertBefore($key, &$array, $new_key, $new_value)
    {
        if (array_key_exists($key, $array)) {
            $new = [];
            foreach ($array as $k => $value) {
                if ($k === $key) {
                    $new[$new_key] = $new_value;
                }
                $new[$k] = $value;
            }

            return $new;
        }

        return false;
    }

    /**
     * Inserts a new key/value after the key in the array.
     *
     * @param $key
     *   The key to insert after.
     * @param $array
     *   An array to insert in to.
     * @param $new_key
     *   The key to insert.
     * @param $new_value
     *   An value to insert.
     * @return Collection|bool The new array if the key exists, FALSE otherwise.
     */
    protected function insertAfter($key, Collection &$array, $new_key, $new_value)
    {
        if ($array->has($key)) {
            $new = [];
            foreach ($array as $k => $value) {
                $new[$k] = $value;
                if ($k === $key) {
                    $new[$new_key] = $new_value;
                }
            }

            return collect($new);
        }

        return false;
    }

    /**
     * Добавление глобальной переменной.
     *
     * @param  string  $key
     * @param  mixed  $value
     * @return self
     */
    public function putGlobalVar($key, $value)
    {
        $this->globalVars[$key] = $value;

        return $this;
    }

    /**
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
