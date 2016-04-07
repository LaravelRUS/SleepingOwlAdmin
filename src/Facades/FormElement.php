<?php

namespace SleepingOwl\Admin\Facades;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Facade;

/**
 * Class AdminForm.
 * @method static \SleepingOwl\Admin\Form\Element\Text text($name, $label = null)
 * @method static \SleepingOwl\Admin\Form\Element\Image image($name, $label = null)
 * @method static \SleepingOwl\Admin\Form\Element\Images images($name, $label = null)
 * @method static \SleepingOwl\Admin\Form\Element\File file($name, $label = null)
 * @method static \SleepingOwl\Admin\Form\Element\Time time($name, $label = null)
 * @method static \SleepingOwl\Admin\Form\Element\Date date($name, $label = null)
 * @method static \SleepingOwl\Admin\Form\Element\Timestamp timestamp($name, $label = null)
 * @method static \SleepingOwl\Admin\Form\Element\TextAddon textaddon($name, $label = null)
 * @method static \SleepingOwl\Admin\Form\Element\Password password($name, $label = null)
 * @method static \SleepingOwl\Admin\Form\Element\Select select($name, $label = null, array|Model $options)
 * @method static \SleepingOwl\Admin\Form\Element\MultiSelect multiselect($name, $label = null, array|Model $options)
 * @method static \SleepingOwl\Admin\Form\Element\Columns columns()
 * @method static \SleepingOwl\Admin\Form\Element\Hidden hidden($name)
 * @method static \SleepingOwl\Admin\Form\Element\Custom custom()
 * @method static \SleepingOwl\Admin\Form\Element\View view($view)
 * @method static \SleepingOwl\Admin\Form\Element\Checkbox checkbox($name, $label = null)
 * @method static \SleepingOwl\Admin\Form\Element\CKEditor ckeditor($name, $label = null)
 * @method static \SleepingOwl\Admin\Form\Element\Textarea textarea($name, $label = null)
 * @method static \SleepingOwl\Admin\Form\Element\Radio radio($name, $label = null)
 * @method static \SleepingOwl\Admin\Form\Element\Wysiwyg wysiwyg($name, $label = null)
 */
class FormElement extends Facade
{
    /**
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'sleeping_owl.form.element';
    }
}
