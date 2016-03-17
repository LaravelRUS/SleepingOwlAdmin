<?php

namespace SleepingOwl\Admin\Providers;

use SleepingOwl\Admin\AliasBinder;
use Illuminate\Support\ServiceProvider;

class AliasesServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->registerColumns();
        $this->registerColumnEditable();
        $this->registerColumnFilters();
        $this->registerDisplays();
        $this->registerForms();
        $this->registerFormElements();
        $this->registerFilters();
    }

    protected function registerColumnFilters()
    {
        $alias = (new AliasBinder())->register([
            'text'   => \SleepingOwl\Admin\Display\Column\Filter\Text::class,
            'date'   => \SleepingOwl\Admin\Display\Column\Filter\Date::class,
            'range'  => \SleepingOwl\Admin\Display\Column\Filter\Range::class,
            'select' => \SleepingOwl\Admin\Display\Column\Filter\Select::class,
        ]);

        $this->app->singleton('sleeping_owl.column_filter', function () use ($alias) {
            return $alias;
        });
    }

    protected function registerDisplays()
    {
        $alias = (new AliasBinder())->register([
            'datatables'      => \SleepingOwl\Admin\Display\DisplayDatatables::class,
            'datatablesAsync' => \SleepingOwl\Admin\Display\DisplayDatatablesAsync::class,
            'tab'             => \SleepingOwl\Admin\Display\DisplayTab::class,
            'tabbed'          => \SleepingOwl\Admin\Display\DisplayTabbed::class,
            'table'           => \SleepingOwl\Admin\Display\DisplayTable::class,
            'tree'            => \SleepingOwl\Admin\Display\DisplayTree::class,
        ]);

        $this->app->singleton('sleeping_owl.display', function () use ($alias) {
            return $alias;
        });
    }

    protected function registerColumns()
    {
        $alias = (new AliasBinder())->register([
            'action'      => \SleepingOwl\Admin\Display\Column\Action::class,
            'checkbox'    => \SleepingOwl\Admin\Display\Column\Checkbox::class,
            'control'     => \SleepingOwl\Admin\Display\Column\Control::class,
            'count'       => \SleepingOwl\Admin\Display\Column\Count::class,
            'custom'      => \SleepingOwl\Admin\Display\Column\Custom::class,
            'datetime'    => \SleepingOwl\Admin\Display\Column\DateTime::class,
            'filter'      => \SleepingOwl\Admin\Display\Column\Filter::class,
            'image'       => \SleepingOwl\Admin\Display\Column\Image::class,
            'lists'       => \SleepingOwl\Admin\Display\Column\Lists::class,
            'order'       => \SleepingOwl\Admin\Display\Column\Order::class,
            'text'        => \SleepingOwl\Admin\Display\Column\Text::class,
            'link'        => \SleepingOwl\Admin\Display\Column\Link::class,
            'relatedLink' => \SleepingOwl\Admin\Display\Column\RelatedLink::class,
            'email'       => \SleepingOwl\Admin\Display\Column\Email::class,
            'treeControl' => \SleepingOwl\Admin\Display\Column\TreeControl::class,
        ]);

        $this->app->singleton('sleeping_owl.table.column', function () use ($alias) {
            return $alias;
        });
    }

    protected function registerColumnEditable()
    {
        $alias = (new AliasBinder())->register([
            'checkbox'    => \SleepingOwl\Admin\Display\Column\Editable\Checkbox::class,
        ]);

        $this->app->singleton('sleeping_owl.table.column.editable', function () use ($alias) {
            return $alias;
        });
    }

    protected function registerFormElements()
    {
        $alias = (new AliasBinder())->register([
            'columns'     => \SleepingOwl\Admin\Form\Element\Columns::class,
            'text'        => \SleepingOwl\Admin\Form\Element\Text::class,
            'time'        => \SleepingOwl\Admin\Form\Element\Time::class,
            'date'        => \SleepingOwl\Admin\Form\Element\Date::class,
            'timestamp'   => \SleepingOwl\Admin\Form\Element\Timestamp::class,
            'textaddon'   => \SleepingOwl\Admin\Form\Element\TextAddon::class,
            'select'      => \SleepingOwl\Admin\Form\Element\Select::class,
            'multiselect' => \SleepingOwl\Admin\Form\Element\MultiSelect::class,
            'hidden'      => \SleepingOwl\Admin\Form\Element\Hidden::class,
            'checkbox'    => \SleepingOwl\Admin\Form\Element\Checkbox::class,
            'ckeditor'    => \SleepingOwl\Admin\Form\Element\CKEditor::class,
            'custom'      => \SleepingOwl\Admin\Form\Element\Custom::class,
            'password'    => \SleepingOwl\Admin\Form\Element\Password::class,
            'textarea'    => \SleepingOwl\Admin\Form\Element\Textarea::class,
            'view'        => \SleepingOwl\Admin\Form\Element\View::class,
            'image'       => \SleepingOwl\Admin\Form\Element\Image::class,
            'images'      => \SleepingOwl\Admin\Form\Element\Images::class,
            'file'        => \SleepingOwl\Admin\Form\Element\File::class,
            'radio'       => \SleepingOwl\Admin\Form\Element\Radio::class,
            'wysiwyg'     => \SleepingOwl\Admin\Form\Element\Wysiwyg::class,
        ]);

        $this->app->singleton('sleeping_owl.form.element', function () use ($alias) {
            return $alias;
        });
    }

    protected function registerForms()
    {
        $alias = (new AliasBinder())->register([
            'form'   => \SleepingOwl\Admin\Form\FormDefault::class,
            'tabbed' => \SleepingOwl\Admin\Form\FormTabbed::class,
            'panel'  => \SleepingOwl\Admin\Form\FormPanel::class,
        ]);

        $this->app->singleton('sleeping_owl.form', function () use ($alias) {
            return $alias;
        });
    }

    protected function registerFilters()
    {
        $alias = (new AliasBinder())->register([
            'field'   => \SleepingOwl\Admin\Display\Filter\FilterField::class,
            'scope'   => \SleepingOwl\Admin\Display\Filter\FilterScope::class,
            'custom'  => \SleepingOwl\Admin\Display\Filter\FilterCustom::class,
            'related' => \SleepingOwl\Admin\Display\Filter\FilterRelated::class,
        ]);

        $this->app->singleton('sleeping_owl.display.filter', function () use ($alias) {
            return $alias;
        });
    }
}
