<?php

namespace SleepingOwl\Admin\Contracts\Template;

interface MetaInterface
{
    public function assets();

    public function addJs(
        $handle = false,
        $src = null,
        $dependency = null,
        $footer = true,
        array $attributes = []
    );

    public function addCss(
        $handle = null,
        $src = null,
        $dependency = null,
        array $attributes = []
    );

    public function loadPackage($names);

    public function putGlobalVar($key, $value);

    public function setTitle($title);

    public function setMetaDescription($description);

    public function setMetaKeywords($keywords);

    public function setMetaRobots($robots);

    public function addMeta(array $attributes, $group = null);

    public function setFavicon(
        $url,
        $rel = 'shortcut icon',
        $type = 'image/x-icon'
    );

    public function renderScripts($footer = false);

    public function render();
}
