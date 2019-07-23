<?php

namespace SleepingOwl\Admin\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static \SleepingOwl\Admin\Display\Filter\FilterCustom custom($name, string|\Closure|null $title = null, \Closure $callback = null)
 * @method static \SleepingOwl\Admin\Display\Filter\FilterField field($name, string|\Closure|null $title = null)
 * @method static \SleepingOwl\Admin\Display\Filter\FilterRelated related($name, string|\Closure|null $title = null)
 * @method static \SleepingOwl\Admin\Display\Filter\FilterScope scope($name, string|\Closure|null $title = null)
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
