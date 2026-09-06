<?php

namespace SleepingOwl\Admin\Templates;

use SleepingOwl\Admin\Contracts\Template\MetaInterface;

class Meta extends \KodiCMS\Assets\Meta implements MetaInterface
{
    public function addJs(
        $handle = false,
        $src = null,
        $dependency = null,
        $footer = true,
        array $attributes = []
    ) {
        $this->assets()->addJs($handle, $src, $dependency, $footer, $attributes);

        return $this;
    }

    public function addCss(
        $handle = null,
        $src = null,
        $dependency = null,
        array $attributes = []
    ) {
        $this->assets()->addCss($handle, $src, $dependency, $attributes);

        return $this;
    }

    public function loadPackage($names)
    {
        $this->assets()->loadPackage(...func_get_args());

        return $this;
    }

    public function putGlobalVar($key, $value)
    {
        $this->assets()->putGlobalVar($key, $value);

        return $this;
    }

    public function renderScripts($footer = false)
    {
        return $this->assets()->renderScripts($footer);
    }
}
