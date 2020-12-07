<?php

namespace SleepingOwl\Admin\Facades;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Facade;

/**
 * @method static \SleepingOwl\Admin\Form\Element\Text text($name, $label = null)
 * @method static \SleepingOwl\Admin\Form\Element\Trix trix($name, $label = null)
 * @method static \SleepingOwl\Admin\Form\Element\Image image($name, $label = null)
 * @method static \SleepingOwl\Admin\Form\Element\Images images($name, $label = null)
 * @method static \SleepingOwl\Admin\Form\Element\File file($name, $label = null)
 * @method static \SleepingOwl\Admin\Form\Element\Files files($name, $label = null)
 * @method static \SleepingOwl\Admin\Form\Element\Time time($name, $label = null)
 * @method static \SleepingOwl\Admin\Form\Element\Date date($name, $label = null)
 * @method static \SleepingOwl\Admin\Form\Element\DateTime datetime($name, $label = null)
 * @method static \SleepingOwl\Admin\Form\Element\Timestamp timestamp($name, $label = null)
 * @method static \SleepingOwl\Admin\Form\Element\TextAddon textaddon($name, $label = null)
 * @method static \SleepingOwl\Admin\Form\Element\Password password($name, $label = null)
 * @method static \SleepingOwl\Admin\Form\Element\Select select($name, $label = null, array|Model|string $options = [])
 * @method static \SleepingOwl\Admin\Form\Element\MultiSelect multiselect($name, $label = null, array|Model|string $options = [])
 * @method static \SleepingOwl\Admin\Form\Element\SelectAjax selectajax($name, $label = null)
 * @method static \SleepingOwl\Admin\Form\Element\MultiSelectAjax multiselectajax($name, $label = null)
 * @method static \SleepingOwl\Admin\Form\Element\DependentSelect dependentselect($name, $label = null, array $depends = [])
 * @method static \SleepingOwl\Admin\Form\Element\MultiDependentSelect multidependentselect($name, $label = null, array $depends = [])
 * @method static \SleepingOwl\Admin\Form\Columns\Columns columns(array $columns = [])
 * @method static \SleepingOwl\Admin\Form\Element\Hidden hidden($name)
 * @method static \SleepingOwl\Admin\Form\Element\Custom custom(\Closure $callback = null)
 * @method static \SleepingOwl\Admin\Form\Element\Html html($html)
 * @method static \SleepingOwl\Admin\Form\Element\View view($view, array $data, \Closure $callback = null)
 * @method static \SleepingOwl\Admin\Form\Element\Checkbox checkbox($name, $label = null)
 * @method static \SleepingOwl\Admin\Form\Element\CKEditor ckeditor($name, $label = null)
 * @method static \SleepingOwl\Admin\Form\Element\Textarea textarea($name, $label = null)
 * @method static \SleepingOwl\Admin\Form\Element\Radio radio($name, $label = null, array $options = [])
 * @method static \SleepingOwl\Admin\Form\Element\Wysiwyg wysiwyg($name, $label = null, $editor = null)
 * @method static \SleepingOwl\Admin\Form\Element\Upload upload($name, $label = null)
 * @method static \SleepingOwl\Admin\Form\Element\Number number($name, $label = null)
 * @method static \SleepingOwl\Admin\Form\Related\Forms\HasMany hasMany(string $relationName, array $elements)
 * @method static \SleepingOwl\Admin\Form\Related\Forms\HasManyLocal hasManyLocal(string $fieldName, array $elements, string $label = '')
 * @method static \SleepingOwl\Admin\Form\Related\Forms\ManyToMany manyToMany(string $relationName, array $elements)
 * @method static \SleepingOwl\Admin\Form\Related\Forms\BelongsTo belongsTo(string $relationName, array $elements)
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
