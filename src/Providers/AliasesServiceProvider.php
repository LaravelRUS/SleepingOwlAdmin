<?php

namespace SleepingOwl\Admin\Providers;

use SleepingOwl\Admin\AliasBinder;
use Illuminate\Support\ServiceProvider;

class AliasesServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->registerColumnFilters();
        $this->registerDisplays();
        $this->registerColumns();
        $this->registerForms();
        $this->registerFormElements();
        $this->registerFilters();
    }

    protected function registerColumnFilters()
    {
        $this->app->singleton('sleeping_owl.column_filter', function () {

            $alias = new AliasBinder();

            $alias->register('text', \SleepingOwl\Admin\Display\Column\Filter\Text::class);
            $alias->register('date', \SleepingOwl\Admin\Display\Column\Filter\Date::class);
            $alias->register('range', \SleepingOwl\Admin\Display\Column\Filter\Range::class);
            $alias->register('select', \SleepingOwl\Admin\Display\Column\Filter\Select::class);

            return $alias;
        });
    }

    protected function registerDisplays()
    {
        $this->app->singleton('sleeping_owl.display', function () {

            $alias = new AliasBinder();

            $alias->register('datatables', \SleepingOwl\Admin\Display\DisplayDatatables::class);
            $alias->register('datatablesAsync', \SleepingOwl\Admin\Display\DisplayDatatablesAsync::class);
            $alias->register('tab', \SleepingOwl\Admin\Display\DisplayTab::class);
            $alias->register('tabbed', \SleepingOwl\Admin\Display\DisplayTabbed::class);
            $alias->register('table', \SleepingOwl\Admin\Display\DisplayTable::class);
            $alias->register('tree', \SleepingOwl\Admin\Display\DisplayTree::class);

            return $alias;
        });
    }

    protected function registerColumns()
    {
        $this->app->singleton('sleeping_owl.table.column', function () {

            $alias = new AliasBinder();

            $alias->register('action', \SleepingOwl\Admin\Display\Column\Action::class);
            $alias->register('checkbox', \SleepingOwl\Admin\Display\Column\Checkbox::class);
            $alias->register('control', \SleepingOwl\Admin\Display\Column\Control::class);
            $alias->register('count', \SleepingOwl\Admin\Display\Column\Count::class);
            $alias->register('custom', \SleepingOwl\Admin\Display\Column\Custom::class);
            $alias->register('datetime', \SleepingOwl\Admin\Display\Column\DateTime::class);
            $alias->register('filter', \SleepingOwl\Admin\Display\Column\Filter::class);
            $alias->register('image', \SleepingOwl\Admin\Display\Column\Image::class);
            $alias->register('lists', \SleepingOwl\Admin\Display\Column\Lists::class);
            $alias->register('order', \SleepingOwl\Admin\Display\Column\Order::class);
            $alias->register('text', \SleepingOwl\Admin\Display\Column\Text::class);
            $alias->register('link', \SleepingOwl\Admin\Display\Column\Link::class);
            $alias->register('relatedLink', \SleepingOwl\Admin\Display\Column\RelatedLink::class);
            $alias->register('email', \SleepingOwl\Admin\Display\Column\Email::class);
            $alias->register('treeControl', \SleepingOwl\Admin\Display\Column\TreeControl::class);

            return $alias;
        });
    }

    protected function registerFormElements()
    {
        $this->app->singleton('sleeping_owl.form.element', function () {

            $alias = new AliasBinder();

            $alias->register('columns', \SleepingOwl\Admin\Form\Element\Columns::class);
            $alias->register('text', \SleepingOwl\Admin\Form\Element\Text::class);
            $alias->register('time', \SleepingOwl\Admin\Form\Element\Time::class);
            $alias->register('date', \SleepingOwl\Admin\Form\Element\Date::class);
            $alias->register('timestamp', \SleepingOwl\Admin\Form\Element\Timestamp::class);
            $alias->register('textaddon', \SleepingOwl\Admin\Form\Element\TextAddon::class);
            $alias->register('select', \SleepingOwl\Admin\Form\Element\Select::class);
            $alias->register('multiselect', \SleepingOwl\Admin\Form\Element\MultiSelect::class);
            $alias->register('hidden', \SleepingOwl\Admin\Form\Element\Hidden::class);
            $alias->register('checkbox', \SleepingOwl\Admin\Form\Element\Checkbox::class);
            $alias->register('ckeditor', \SleepingOwl\Admin\Form\Element\CKEditor::class);
            $alias->register('custom', \SleepingOwl\Admin\Form\Element\Custom::class);
            $alias->register('password', \SleepingOwl\Admin\Form\Element\Password::class);
            $alias->register('textarea', \SleepingOwl\Admin\Form\Element\Textarea::class);
            $alias->register('view', \SleepingOwl\Admin\Form\Element\View::class);
            $alias->register('image', \SleepingOwl\Admin\Form\Element\Image::class);
            $alias->register('images', \SleepingOwl\Admin\Form\Element\Images::class);
            $alias->register('file', \SleepingOwl\Admin\Form\Element\File::class);
            $alias->register('radio', \SleepingOwl\Admin\Form\Element\Radio::class);
            $alias->register('wysiwyg', \SleepingOwl\Admin\Form\Element\Wysiwyg::class);

            return $alias;
        });
    }

    protected function registerForms()
    {
        $this->app->singleton('sleeping_owl.form', function () {

            $alias = new AliasBinder();

            $alias->register('form', \SleepingOwl\Admin\Form\FormDefault::class);
            $alias->register('tabbed', \SleepingOwl\Admin\Form\FormTabbed::class);
            $alias->register('panel', \SleepingOwl\Admin\Form\FormPanel::class);

            return $alias;
        });
    }

    protected function registerFilters()
    {
        $this->app->singleton('sleeping_owl.display.filter', function () {

            $alias = new AliasBinder();

            $alias->register('field', \SleepingOwl\Admin\Display\Filter\FilterField::class);
            $alias->register('scope', \SleepingOwl\Admin\Display\Filter\FilterScope::class);
            $alias->register('custom', \SleepingOwl\Admin\Display\Filter\FilterCustom::class);
            $alias->register('related', \SleepingOwl\Admin\Display\Filter\FilterRelated::class);

            return $alias;
        });
    }
}
