<?php

namespace SleepingOwl\Admin\Templates;

use SleepingOwl\Admin\Contracts\Template\MetaInterface;

class Meta extends \KodiCMS\Assets\Meta implements MetaInterface
{
    public function putGlobalVar($var, $value)
    {
        return $this->assets()->putGlobalVar($var, $value);
    }
}
