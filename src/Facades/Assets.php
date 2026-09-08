<?php

namespace SleepingOwl\Admin\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static \SleepingOwl\Admin\Assets\Asset addJs(string|false $handle = false, ?string $src = null, string|array|null $dependency = null, bool $footer = true, array $attributes = [])
 * @method static \SleepingOwl\Admin\Assets\Asset addCss(?string $handle = null, ?string $src = null, string|array|null $dependency = null, array $attributes = [])
 * @method static \SleepingOwl\Admin\Templates\Assets clear()
 * @method static \SleepingOwl\Admin\Templates\Assets loadPackage(string|array $names)
 * @method static string renderScripts(bool $footer = false)
 * @method static string renderStyles()
 */
class Assets extends Facade
{
    public static function getFacadeAccessor(): string
    {
        return 'assets';
    }
}
