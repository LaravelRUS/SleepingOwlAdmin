<?php

namespace SleepingOwl\Admin\Providers;

use SleepingOwl\Admin\DisplayFilter;
use Illuminate\Support\ServiceProvider;

class FilterServiceProvider extends ServiceProvider
{
    public function register()
    {
        DisplayFilter::register('field', \SleepingOwl\Admin\Filter\FilterField::class);
        DisplayFilter::register('scope', \SleepingOwl\Admin\Filter\FilterScope::class);
        DisplayFilter::register('custom', \SleepingOwl\Admin\Filter\FilterCustom::class);
        DisplayFilter::register('related', \SleepingOwl\Admin\Filter\FilterRelated::class);
    }
}
