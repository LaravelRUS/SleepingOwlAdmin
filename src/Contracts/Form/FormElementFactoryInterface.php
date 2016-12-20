<?php

namespace SleepingOwl\Admin\Contracts\Form;

use SleepingOwl\Admin\Form\Columns;
use SleepingOwl\Admin\Form\Element;
use SleepingOwl\Admin\Factories\Model;

/**
 * @method Element\Text text($name, $label = null)
 * @method Element\Image image($name, $label = null)
 * @method Element\Images images($name, $label = null)
 * @method Element\File file($name, $label = null)
 * @method Element\Time time($name, $label = null)
 * @method Element\Date date($name, $label = null)
 * @method Element\Timestamp timestamp($name, $label = null)
 * @method Element\TextAddon textaddon($name, $label = null)
 * @method Element\Password password($name, $label = null)
 * @method Element\Select select($name, $label = null, array|Model $options)
 * @method Element\MultiSelect multiselect($name, $label = null, array|Model $options)
 * @method Columns\Columns columns(array $columns = [])
 * @method Element\Hidden hidden($name)
 * @method Element\Custom custom(\Closure $callback = null)
 * @method Element\Html html($html)
 * @method Element\View view($view, array $data, \Closure $callback = null)
 * @method Element\Checkbox checkbox($name, $label = null)
 * @method Element\CKEditor ckeditor($name, $label = null)
 * @method Element\Textarea textarea($name, $label = null)
 * @method Element\Radio radio($name, $label = null)
 * @method Element\Wysiwyg wysiwyg($name, $label = null, $editor = null)
 * @method Element\Upload upload($name, $label = null)
 * @method Element\Number number($name, $label = null)
 * @method Element\DependentSelect dependentselect($name, $label = null, array|Model $options)
 */
interface FormElementFactoryInterface
{
}
