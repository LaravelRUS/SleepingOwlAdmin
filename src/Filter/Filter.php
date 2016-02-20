<?php

namespace SleepingOwl\Admin\Filter;

use SleepingOwl\Admin\AliasBinder;

/**
 * Class Filter.
 * @method static \SleepingOwl\Admin\Filter\FilterCustom custom($name)
 * @method static \SleepingOwl\Admin\Filter\FilterField field($name)
 * @method static \SleepingOwl\Admin\Filter\FilterRelated related($name)
 * @method static \SleepingOwl\Admin\Filter\FilterScope scope($name)
 */
class Filter extends AliasBinder
{
    /**
     * @var array
     */
    protected static $aliases = [];
}
