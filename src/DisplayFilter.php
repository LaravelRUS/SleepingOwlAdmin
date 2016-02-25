<?php

namespace SleepingOwl\Admin;

/**
 * Class Filter.
 * @method static \SleepingOwl\Admin\Display\Filter\FilterCustom custom($name)
 * @method static \SleepingOwl\Admin\Display\Filter\FilterField field($name)
 * @method static \SleepingOwl\Admin\Display\Filter\FilterRelated related($name)
 * @method static \SleepingOwl\Admin\Display\Filter\FilterScope scope($name)
 */
class DisplayFilter extends AliasBinder
{
    /**
     * @var array
     */
    protected static $aliases = [];
}
