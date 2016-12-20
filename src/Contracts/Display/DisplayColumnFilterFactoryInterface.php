<?php

namespace SleepingOwl\Admin\Contracts\Display;

use SleepingOwl\Admin\Display\Column\Filter\Date;
use SleepingOwl\Admin\Display\Column\Filter\Text;
use SleepingOwl\Admin\Display\Column\Filter\Range;
use SleepingOwl\Admin\Display\Column\Filter\Select;

/**
 * @method Text text()
 * @method Date date()
 * @method Select select()
 * @method Range range()
 */
interface DisplayColumnFilterFactoryInterface
{
}
