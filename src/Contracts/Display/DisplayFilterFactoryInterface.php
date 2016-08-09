<?php

namespace SleepingOwl\Admin\Contracts\Display;

use SleepingOwl\Admin\Display\Filter;

/**
 * @method Filter\FilterCustom custom($name, string|\Closure|null $title, \Closure $callback)
 * @method Filter\FilterField field($name, string|\Closure|null $title)
 * @method Filter\FilterRelated related($name, string|\Closure|null $title)
 * @method Filter\FilterScope scope($name, string|\Closure|null $title)
 */
interface DisplayFilterFactoryInterface
{
}
