<?php

namespace SleepingOwl\Admin\Providers;

use Illuminate\Support\ServiceProvider;
use SleepingOwl\Admin\FormItems\FormItem;

class FormItemServiceProvider extends ServiceProvider
{
    public function register()
    {
        FormItem::register('columns', \SleepingOwl\Admin\FormItems\Columns::class);
        FormItem::register('text', \SleepingOwl\Admin\FormItems\Text::class);
        FormItem::register('time', \SleepingOwl\Admin\FormItems\Time::class);
        FormItem::register('date', \SleepingOwl\Admin\FormItems\Date::class);
        FormItem::register('timestamp', \SleepingOwl\Admin\FormItems\Timestamp::class);
        FormItem::register('textaddon', \SleepingOwl\Admin\FormItems\TextAddon::class);
        FormItem::register('select', \SleepingOwl\Admin\FormItems\Select::class);
        FormItem::register('multiselect', \SleepingOwl\Admin\FormItems\MultiSelect::class);
        FormItem::register('hidden', \SleepingOwl\Admin\FormItems\Hidden::class);
        FormItem::register('checkbox', \SleepingOwl\Admin\FormItems\Checkbox::class);
        FormItem::register('ckeditor', \SleepingOwl\Admin\FormItems\CKEditor::class);
        FormItem::register('custom', \SleepingOwl\Admin\FormItems\Custom::class);
        FormItem::register('password', \SleepingOwl\Admin\FormItems\Password::class);
        FormItem::register('textarea', \SleepingOwl\Admin\FormItems\Textarea::class);
        FormItem::register('view', \SleepingOwl\Admin\FormItems\View::class);
        FormItem::register('image', \SleepingOwl\Admin\FormItems\Image::class);
        FormItem::register('images', \SleepingOwl\Admin\FormItems\Images::class);
        FormItem::register('file', \SleepingOwl\Admin\FormItems\File::class);
        FormItem::register('radio', \SleepingOwl\Admin\FormItems\Radio::class);
        FormItem::register('wysiwyg', \SleepingOwl\Admin\FormItems\Wysiwyg::class);
    }
}
