<?php

namespace SleepingOwl\Admin\Providers;

use SleepingOwl\Admin\DisplayFilter;
use Illuminate\Support\ServiceProvider;

class FilterServiceProvider extends ServiceProvider
{
    public function register()
    {
        DisplayFilter::register('field', \SleepingOwl\Admin\Display\Filter\FilterField::class);
        DisplayFilter::register('scope', \SleepingOwl\Admin\Display\Filter\FilterScope::class);
        DisplayFilter::register('custom', \SleepingOwl\Admin\Display\Filter\FilterCustom::class);
        DisplayFilter::register('related', \SleepingOwl\Admin\Display\Filter\FilterRelated::class);
    }
}
