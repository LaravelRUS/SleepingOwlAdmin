<?php

namespace SleepingOwl\Admin\Providers;

use SleepingOwl\Admin\Filter\Filter;
use Illuminate\Support\ServiceProvider;

class FilterServiceProvider extends ServiceProvider
{
    public function register()
    {
        Filter::register('field', \SleepingOwl\Admin\Filter\FilterField::class);
        Filter::register('scope', \SleepingOwl\Admin\Filter\FilterScope::class);
        Filter::register('custom', \SleepingOwl\Admin\Filter\FilterCustom::class);
        Filter::register('related', \SleepingOwl\Admin\Filter\FilterRelated::class);
    }
}
