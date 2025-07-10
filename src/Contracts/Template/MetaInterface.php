<?php

namespace SleepingOwl\Admin\Contracts\Template;

interface MetaInterface extends \KodiCMS\Assets\Contracts\MetaInterface
{
    public function putGlobalVar(int $var, $value);
}
