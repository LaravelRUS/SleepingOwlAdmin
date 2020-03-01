<?php

namespace SleepingOwl\Admin\Providers;

use Illuminate\Support\ServiceProvider;
use SleepingOwl\Admin\Contracts\Display\DisplayColumnEditableFactoryInterface;
use SleepingOwl\Admin\Contracts\Display\DisplayColumnFactoryInterface;
use SleepingOwl\Admin\Contracts\Display\DisplayColumnFilterFactoryInterface;
use SleepingOwl\Admin\Contracts\Display\DisplayFactoryInterface;
use SleepingOwl\Admin\Contracts\Display\DisplayFilterFactoryInterface;
use SleepingOwl\Admin\Contracts\Form\FormButtonsFactoryInterface;
use SleepingOwl\Admin\Contracts\Form\FormElementFactoryInterface;
use SleepingOwl\Admin\Contracts\Form\FormFactoryInterface;
use SleepingOwl\Admin\Factories\DisplayColumnEditableFactory;
use SleepingOwl\Admin\Factories\DisplayColumnFactory;
use SleepingOwl\Admin\Factories\DisplayColumnFilterFactory;
use SleepingOwl\Admin\Factories\DisplayFactory;
use SleepingOwl\Admin\Factories\DisplayFilterFactory;
use SleepingOwl\Admin\Factories\FormButtonsFactory;
use SleepingOwl\Admin\Factories\FormElementFactory;
use SleepingOwl\Admin\Factories\FormFactory;

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
        $this->registerFormButtons();
    }

    protected function registerFormButtons()
    {
        $this->app->instance(
            'sleeping_owl.form_buttons',
            $this->app->make(FormButtonsFactory::class)
        );
        $this->app->alias(
            'sleeping_owl.form_buttons',
            FormButtonsFactoryInterface::class
        );
    }

    protected function registerColumnFilters()
    {
        $this->app->instance(
            'sleeping_owl.column_filter',
            $this->app->make(DisplayColumnFilterFactory::class)
        );
        $this->app->alias(
            'sleeping_owl.column_filter',
            DisplayColumnFilterFactoryInterface::class
        );
    }

    protected function registerDisplays()
    {
        $this->app->instance(
            'sleeping_owl.display',
            $this->app->make(DisplayFactory::class)
        );
        $this->app->alias(
            'sleeping_owl.display',
            DisplayFactoryInterface::class
        );
    }

    protected function registerColumns()
    {
        $this->app->instance(
            'sleeping_owl.table.column',
            $this->app->make(DisplayColumnFactory::class)
        );
        $this->app->alias(
            'sleeping_owl.table.column',
            DisplayColumnFactoryInterface::class
        );
    }

    protected function registerColumnEditable()
    {
        $this->app->instance(
            'sleeping_owl.table.column.editable',
            $this->app->make(DisplayColumnEditableFactory::class)
        );

        $this->app->alias(
            'sleeping_owl.table.column.editable',
            DisplayColumnEditableFactoryInterface::class
        );
    }

    protected function registerFormElements()
    {
        $this->app->instance(
            'sleeping_owl.form.element',
            $this->app->make(FormElementFactory::class)
        );
        $this->app->alias(
            'sleeping_owl.form.element',
            FormElementFactoryInterface::class
        );
    }

    protected function registerForms()
    {
        $this->app->instance(
            'sleeping_owl.form',
            $this->app->make(FormFactory::class)
        );
        $this->app->alias(
            'sleeping_owl.form',
            FormFactoryInterface::class
        );
    }

    protected function registerFilters()
    {
        $this->app->instance(
            'sleeping_owl.display.filter',
            $this->app->make(DisplayFilterFactory::class)
        );

        $this->app->alias(
            'sleeping_owl.display.filter',
            DisplayFilterFactoryInterface::class
        );
    }
}
