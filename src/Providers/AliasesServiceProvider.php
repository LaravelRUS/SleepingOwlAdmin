<?php

namespace SleepingOwl\Admin\Providers;

use Illuminate\Support\ServiceProvider;
use SleepingOwl\Admin\Contracts\Display\DisplayColumnEditableFactoryInterface;
use SleepingOwl\Admin\Contracts\Display\DisplayColumnFilterFactoryInterface;
use SleepingOwl\Admin\Contracts\Display\DisplayColumnFactoryInterface;
use SleepingOwl\Admin\Contracts\Display\DisplayFactoryInterface;
use SleepingOwl\Admin\Contracts\Display\DisplayFilterFactoryInterface;
use SleepingOwl\Admin\Contracts\Form\FormElementFactoryInterface;
use SleepingOwl\Admin\Contracts\Form\FormFactoryInterface;
use SleepingOwl\Admin\Display;
use SleepingOwl\Admin\Factories\DisplayColumnEditableFactory;
use SleepingOwl\Admin\Factories\DisplayColumnFilterFactory;
use SleepingOwl\Admin\Factories\DisplayColumnFactory;
use SleepingOwl\Admin\Factories\DisplayFactory;
use SleepingOwl\Admin\Factories\DisplayFilterFactory;
use SleepingOwl\Admin\Factories\FormElementFactory;
use SleepingOwl\Admin\Factories\FormFactory;
use SleepingOwl\Admin\Form;

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
        $alias = (new DisplayColumnFilterFactory($this->app))->register([
            'text'   => Display\Column\Filter\Text::class,
            'date'   => Display\Column\Filter\Date::class,
            'range'  => Display\Column\Filter\Range::class,
            'select' => Display\Column\Filter\Select::class,
        ]);

        $this->app->singleton('sleeping_owl.column_filter', function () use ($alias) {
            return $alias;
        });
        $this->app->alias('sleeping_owl.column_filter', DisplayColumnFilterFactoryInterface::class);
    }

    protected function registerDisplays()
    {
        $alias = (new DisplayFactory($this->app))->register([
            'datatables'      => Display\DisplayDatatables::class,
            'datatablesAsync' => Display\DisplayDatatablesAsync::class,
            'tab'             => Display\DisplayTab::class,
            'tabbed'          => Display\DisplayTabbed::class,
            'table'           => Display\DisplayTable::class,
            'tree'            => Display\DisplayTree::class,
        ]);

        $this->app->singleton('sleeping_owl.display', function () use ($alias) {
            return $alias;
        });
        $this->app->alias('sleeping_owl.display', DisplayFactoryInterface::class);
    }

    protected function registerColumns()
    {
        $alias = (new DisplayColumnFactory($this->app))->register([
            'action'      => Display\Column\Action::class,
            'checkbox'    => Display\Column\Checkbox::class,
            'control'     => Display\Column\Control::class,
            'count'       => Display\Column\Count::class,
            'custom'      => Display\Column\Custom::class,
            'datetime'    => Display\Column\DateTime::class,
            'filter'      => Display\Column\Filter::class,
            'image'       => Display\Column\Image::class,
            'lists'       => Display\Column\Lists::class,
            'order'       => Display\Column\Order::class,
            'text'        => Display\Column\Text::class,
            'link'        => Display\Column\Link::class,
            'relatedLink' => Display\Column\RelatedLink::class,
            'email'       => Display\Column\Email::class,
            'treeControl' => Display\Column\TreeControl::class,
            'url'         => Display\Column\Url::class,
        ]);

        $this->app->singleton('sleeping_owl.table.column', function () use ($alias) {
            return $alias;
        });
        $this->app->alias('sleeping_owl.table.column', DisplayColumnFactoryInterface::class);
    }

    protected function registerColumnEditable()
    {
        $alias = (new DisplayColumnEditableFactory($this->app))->register([
            'checkbox'    => Display\Column\Editable\Checkbox::class,
        ]);

        $this->app->singleton('sleeping_owl.table.column.editable', function () use ($alias) {
            return $alias;
        });
        $this->app->alias('sleeping_owl.table.column.editable', DisplayColumnEditableFactoryInterface::class);
    }

    protected function registerFormElements()
    {
        $alias = (new FormElementFactory($this->app))->register([
            'columns'     => Form\Columns\Columns::class,
            'text'        => Form\Element\Text::class,
            'time'        => Form\Element\Time::class,
            'date'        => Form\Element\Date::class,
            'timestamp'   => Form\Element\Timestamp::class,
            'textaddon'   => Form\Element\TextAddon::class,
            'select'      => Form\Element\Select::class,
            'multiselect' => Form\Element\MultiSelect::class,
            'hidden'      => Form\Element\Hidden::class,
            'checkbox'    => Form\Element\Checkbox::class,
            'ckeditor'    => Form\Element\CKEditor::class,
            'custom'      => Form\Element\Custom::class,
            'password'    => Form\Element\Password::class,
            'textarea'    => Form\Element\Textarea::class,
            'view'        => Form\Element\View::class,
            'image'       => Form\Element\Image::class,
            'images'      => Form\Element\Images::class,
            'file'        => Form\Element\File::class,
            'radio'       => Form\Element\Radio::class,
            'wysiwyg'     => Form\Element\Wysiwyg::class,
            'upload'      => Form\Element\Upload::class,
            'html'        => Form\Element\Html::class,
        ]);

        $this->app->singleton('sleeping_owl.form.element', function () use ($alias) {
            return $alias;
        });
        $this->app->alias('sleeping_owl.form.element', FormElementFactoryInterface::class);
    }

    protected function registerForms()
    {
        $alias = (new FormFactory($this->app))->register([
            'form' => Form\FormDefault::class,
            'elements' => Form\FormElements::class,
            'tabbed' => Form\FormTabbed::class,
            'panel' => Form\FormPanel::class,
        ]);

        $this->app->singleton('sleeping_owl.form', function () use ($alias) {
            return $alias;
        });
        $this->app->alias('sleeping_owl.form', FormFactoryInterface::class);
    }

    protected function registerFilters()
    {
        $alias = (new DisplayFilterFactory($this->app))->register([
            'field'   => Display\Filter\FilterField::class,
            'scope'   => Display\Filter\FilterScope::class,
            'custom'  => Display\Filter\FilterCustom::class,
            'related' => Display\Filter\FilterRelated::class,
        ]);

        $this->app->singleton('sleeping_owl.display.filter', function () use ($alias) {
            return $alias;
        });
        $this->app->alias('sleeping_owl.display.filter', DisplayFilterFactoryInterface::class);
    }
}
