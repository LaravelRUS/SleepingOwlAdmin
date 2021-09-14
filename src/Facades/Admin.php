<?php

namespace SleepingOwl\Admin\Facades;

use Illuminate\Contracts\Support\Renderable;
use Illuminate\Support\Facades\Facade;
use SleepingOwl\Admin\Section;

/**
 * @see \SleepingOwl\Admin\Admin
 *
 * @method static Section getModel(string|object $class)
 * @method static Section view(string|Renderable $content, null|string $title)
 */
class Admin extends Facade
{
    /**
     * @return string
     */
    public static function getFacadeAccessor()
    {
        return 'sleeping_owl';
    }
}
