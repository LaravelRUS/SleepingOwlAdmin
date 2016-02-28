<?php

namespace SleepingOwl\Admin\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * Class Filter.
 * @method static \SleepingOwl\Admin\Display\Filter\FilterCustom custom($name)
 * @method static \SleepingOwl\Admin\Display\Filter\FilterField field($name)
 * @method static \SleepingOwl\Admin\Display\Filter\FilterRelated related($name)
 * @method static \SleepingOwl\Admin\Display\Filter\FilterScope scope($name)
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
