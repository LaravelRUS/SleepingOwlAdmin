<?php

namespace SleepingOwl\Admin\Contracts\Template;

interface AssetsInterface
{
    public function clear();

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

    public function renderScripts($footer = false);

    public function renderStyles();

    public function render();
}
