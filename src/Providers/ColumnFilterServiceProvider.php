<?php

namespace SleepingOwl\Admin\Providers;

use Illuminate\Support\ServiceProvider;
use SleepingOwl\Admin\TableColumnFilter;

class ColumnFilterServiceProvider extends ServiceProvider
{
    public function register()
    {
        TableColumnFilter::register('text', \SleepingOwl\Admin\Display\Column\Filter\Text::class);
        TableColumnFilter::register('date', \SleepingOwl\Admin\Display\Column\Filter\Date::class);
        TableColumnFilter::register('range', \SleepingOwl\Admin\Display\Column\Filter\Range::class);
        TableColumnFilter::register('select', \SleepingOwl\Admin\Display\Column\Filter\Select::class);
    }
}
