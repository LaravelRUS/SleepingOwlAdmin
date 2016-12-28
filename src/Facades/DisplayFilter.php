<?php

namespace SleepingOwl\Admin\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static \SleepingOwl\Admin\Display\Filter\FilterCustom custom($name, string|\Closure|null $title, \Closure $callback)
 * @method static \SleepingOwl\Admin\Display\Filter\FilterField field($name, string|\Closure|null $title)
 * @method static \SleepingOwl\Admin\Display\Filter\FilterRelated related($namem, string|\Closure|null $title)
 * @method static \SleepingOwl\Admin\Display\Filter\FilterScope scope($name, string|\Closure|null $title)
 */
class DisplayFilter extends Facade
{
    /**
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'sleeping_owl.display.filter';
    }
}
