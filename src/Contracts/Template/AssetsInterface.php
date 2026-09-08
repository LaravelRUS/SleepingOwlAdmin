<?php

namespace SleepingOwl\Admin\Contracts\Template;

interface AssetsInterface
{
    /** @return $this */
    public function clear();

    /**
     * @param  string|false  $handle
     * @param  string|null  $src
     * @param  string|list<string>|null  $dependency
     * @param  array<int|string, mixed>  $attributes
     * @return \SleepingOwl\Admin\Assets\Asset
     */
    public function addJs(
        $handle = false,
        $src = null,
        $dependency = null,
        $footer = true,
        array $attributes = []
    );

    /**
     * @param  string|null  $handle
     * @param  string|null  $src
     * @param  string|list<string>|null  $dependency
     * @param  array<int|string, mixed>  $attributes
     * @return \SleepingOwl\Admin\Assets\Asset
     */
    public function addCss(
        $handle = null,
        $src = null,
        $dependency = null,
        array $attributes = []
    );

    /**
     * @param  string|list<string>  $names
     * @return $this
     */
    public function loadPackage($names);

    /** @return $this */
    public function putGlobalVar($key, $value);

    /** @return string */
    public function renderScripts($footer = false);

    /** @return string */
    public function renderStyles();

    /** @return string */
    public function render();
}
