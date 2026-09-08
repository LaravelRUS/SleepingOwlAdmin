<?php

namespace SleepingOwl\Admin\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static \SleepingOwl\Admin\Contracts\Template\AssetsInterface assets()
 * @method static \SleepingOwl\Admin\Templates\Meta addJs(string|false $handle = false, ?string $src = null, string|array|null $dependency = null, bool $footer = true, array $attributes = [])
 * @method static \SleepingOwl\Admin\Templates\Meta addCss(?string $handle = null, ?string $src = null, string|array|null $dependency = null, array $attributes = [])
 * @method static \SleepingOwl\Admin\Templates\Meta setTitle(string $title)
 * @method static string renderScripts(bool $footer = false)
 * @method static string render()
 */
class Meta extends Facade
{
    /**
     * @return string
     */
    public static function getFacadeAccessor()
    {
        return 'sleeping_owl.meta';
    }
}
