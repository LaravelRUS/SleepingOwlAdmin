<?php

namespace SleepingOwl\Admin\Factories;

use SleepingOwl\Admin\AliasBinder;
use SleepingOwl\Admin\Form\Columns;
use SleepingOwl\Admin\Form\Element;
use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Contracts\Form\FormElementFactoryInterface;

/**
 * @method Element\Text text($name, $label = null)
 * @method Element\Image image($name, $label = null)
 * @method Element\Images images($name, $label = null)
 * @method Element\File file($name, $label = null)
 * @method Element\Time time($name, $label = null)
 * @method Element\Date date($name, $label = null)
 * @method Element\DateRange daterange($name, $label = null)
 * @method Element\Timestamp timestamp($name, $label = null)
 * @method Element\TextAddon textaddon($name, $label = null)
 * @method Element\Password password($name, $label = null)
 * @method Element\Select select($name, $label = null, array|Model $options)
 * @method Element\MultiSelect multiselect($name, $label = null, array|Model $options)
 * @method Columns\Columns columns(array $columns = [])
 * @method Columns\Columns column()
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
class FormElementFactory extends AliasBinder implements FormElementFactoryInterface
{
    /**
     * FormElementFactory constructor.
     *
     * @param \Illuminate\Contracts\Foundation\Application $application
     */
    public function __construct(\Illuminate\Contracts\Foundation\Application $application)
    {
        parent::__construct($application);

        $this->register([
            'columns' => Columns\Columns::class,
            'column' => Columns\Column::class,
            'text' => Element\Text::class,
            'time' => Element\Time::class,
            'date' => Element\Date::class,
            'datetime' => Element\DateTime::class,
            'daterange' => Element\DateRange::class,
            'timestamp' => Element\Timestamp::class,
            'textaddon' => Element\TextAddon::class,
            'select' => Element\Select::class,
            'multiselect' => Element\MultiSelect::class,
            'hidden' => Element\Hidden::class,
            'checkbox' => Element\Checkbox::class,
            'ckeditor' => Element\CKEditor::class,
            'custom' => Element\Custom::class,
            'password' => Element\Password::class,
            'textarea' => Element\Textarea::class,
            'view' => Element\View::class,
            'image' => Element\Image::class,
            'images' => Element\Images::class,
            'file' => Element\File::class,
            'radio' => Element\Radio::class,
            'wysiwyg' => Element\Wysiwyg::class,
            'upload' => Element\Upload::class,
            'html' => Element\Html::class,
            'number' => Element\Number::class,
            'dependentselect' => Element\DependentSelect::class,
        ]);
    }
}
