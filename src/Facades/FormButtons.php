<?php

namespace SleepingOwl\Admin\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static \SleepingOwl\Admin\Form\Buttons\Save save()
 * @method static \SleepingOwl\Admin\Form\Buttons\SaveAndCreate saveAndCreate()
 * @method static \SleepingOwl\Admin\Form\Buttons\SaveAndClose saveAndClose()
 * @method static \SleepingOwl\Admin\Form\Buttons\Delete delete()
 * @method static \SleepingOwl\Admin\Form\Buttons\Destroy destroy()
 * @method static \SleepingOwl\Admin\Form\Buttons\Restore restore()
 * @method static \SleepingOwl\Admin\Form\Buttons\Cancel cancel()
 */
class FormButtons extends Facade
{
    public static function getFacadeAccessor()
    {
        return 'sleeping_owl.form_buttons';
    }
}
