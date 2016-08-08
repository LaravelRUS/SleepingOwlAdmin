<?php

namespace SleepingOwl\Admin\Contracts;

use KodiCMS\Assets\Package;

interface AssetsInterface
{
    /**
     * @return Package
     */
    public function loadPackage();
}
