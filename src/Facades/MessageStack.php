<?php

namespace SleepingOwl\Admin\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static \SleepingOwl\Admin\Widgets\Messages\ErrorMessages addError($text)
 * @method static \SleepingOwl\Admin\Widgets\Messages\InfoMessages addInfo($text)
 * @method static \SleepingOwl\Admin\Widgets\Messages\SuccessMessages addSuccess($text)
 * @method static \SleepingOwl\Admin\Widgets\Messages\WarningMessages addWarning($text)
 */
class MessageStack extends Facade
{
    public static function getFacadeAccessor()
    {
        return 'sleeping_owl.message';
    }
}
