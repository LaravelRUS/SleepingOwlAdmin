<?php

namespace SleepingOwl\Admin\Providers;

use Illuminate\Support\ServiceProvider;
use SleepingOwl\Admin\Column\Filter\ColumnFilter;

class ColumnFilterServiceProvider extends ServiceProvider
{
    public function register()
    {
        ColumnFilter::register('text', \SleepingOwl\Admin\Column\Filter\Text::class);
        ColumnFilter::register('date', \SleepingOwl\Admin\Column\Filter\Date::class);
        ColumnFilter::register('range', \SleepingOwl\Admin\Column\Filter\Range::class);
        ColumnFilter::register('select', \SleepingOwl\Admin\Column\Filter\Select::class);
    }
}
