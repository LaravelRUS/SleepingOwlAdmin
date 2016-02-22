<?php

namespace SleepingOwl\Admin\Providers;

use Illuminate\Support\ServiceProvider;
use SleepingOwl\Admin\FormElement;

class FormElementsServiceProvider extends ServiceProvider
{
    public function register()
    {
        FormElement::register('columns', \SleepingOwl\Admin\Form\Element\Columns::class);
        FormElement::register('text', \SleepingOwl\Admin\Form\Element\Text::class);
        FormElement::register('time', \SleepingOwl\Admin\Form\Element\Time::class);
        FormElement::register('date', \SleepingOwl\Admin\Form\Element\Date::class);
        FormElement::register('timestamp', \SleepingOwl\Admin\Form\Element\Timestamp::class);
        FormElement::register('textaddon', \SleepingOwl\Admin\Form\Element\TextAddon::class);
        FormElement::register('select', \SleepingOwl\Admin\Form\Element\Select::class);
        FormElement::register('multiselect', \SleepingOwl\Admin\Form\Element\MultiSelect::class);
        FormElement::register('hidden', \SleepingOwl\Admin\Form\Element\Hidden::class);
        FormElement::register('checkbox', \SleepingOwl\Admin\Form\Element\Checkbox::class);
        FormElement::register('ckeditor', \SleepingOwl\Admin\Form\Element\CKEditor::class);
        FormElement::register('custom', \SleepingOwl\Admin\Form\Element\Custom::class);
        FormElement::register('password', \SleepingOwl\Admin\Form\Element\Password::class);
        FormElement::register('textarea', \SleepingOwl\Admin\Form\Element\Textarea::class);
        FormElement::register('view', \SleepingOwl\Admin\Form\Element\View::class);
        FormElement::register('image', \SleepingOwl\Admin\Form\Element\Image::class);
        FormElement::register('images', \SleepingOwl\Admin\Form\Element\Images::class);
        FormElement::register('file', \SleepingOwl\Admin\Form\Element\File::class);
        FormElement::register('radio', \SleepingOwl\Admin\Form\Element\Radio::class);
        FormElement::register('wysiwyg', \SleepingOwl\Admin\Form\Element\Wysiwyg::class);
    }
}
