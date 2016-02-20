<?php

namespace SleepingOwl\Admin\Providers;

use SleepingOwl\Admin\Column;
use Illuminate\Support\ServiceProvider;

class ColumnServiceProvider extends ServiceProvider
{
    public function register()
    {
        Column::register('action', \SleepingOwl\Admin\Column\Action::class);
        Column::register('checkbox', \SleepingOwl\Admin\Column\Checkbox::class);
        Column::register('control', \SleepingOwl\Admin\Column\Control::class);
        Column::register('count', \SleepingOwl\Admin\Column\Count::class);
        Column::register('custom', \SleepingOwl\Admin\Column\Custom::class);
        Column::register('datetime', \SleepingOwl\Admin\Column\DateTime::class);
        Column::register('filter', \SleepingOwl\Admin\Column\Filter::class);
        Column::register('image', \SleepingOwl\Admin\Column\Image::class);
        Column::register('lists', \SleepingOwl\Admin\Column\Lists::class);
        Column::register('order', \SleepingOwl\Admin\Column\Order::class);
        Column::register('string', \SleepingOwl\Admin\Column\String::class);
        Column::register('link', \SleepingOwl\Admin\Column\Link::class);
        Column::register('email', \SleepingOwl\Admin\Column\Email::class);
        Column::register('treeControl', \SleepingOwl\Admin\Column\TreeControl::class);
        Column::register('url', \SleepingOwl\Admin\Column\Url::class);
    }
}
