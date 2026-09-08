<?php

namespace SleepingOwl\Admin\Contracts\Template;

interface MetaInterface
{
    /** @return AssetsInterface */
    public function assets();

    /**
     * @param  string|false  $handle
     * @param  string|null  $src
     * @param  string|list<string>|null  $dependency
     * @param  array<int|string, mixed>  $attributes
     * @return $this
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
     * @return $this
     */
    public function addCss(
        $handle = null,
        $src = null,
        $dependency = null,
        array $attributes = []
    );

    /** @return $this */
    public function loadPackage($names);

    /** @return $this */
    public function putGlobalVar($key, $value);

    /** @return $this */
    public function setTitle($title);

    /** @return $this */
    public function setMetaDescription($description);

    /** @return $this */
    public function setMetaKeywords($keywords);

    /** @return $this */
    public function setMetaRobots($robots);

    /** @return $this */
    public function addMeta(array $attributes, $group = null);

    public function setFavicon(
        $url,
        $rel = 'shortcut icon',
        $type = 'image/x-icon'
    );

    /** @return string */
    public function renderScripts($footer = false);

    /** @return string */
    public function render();
}
