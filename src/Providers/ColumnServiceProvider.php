<?php

namespace SleepingOwl\Admin\Providers;

use SleepingOwl\Admin\TableColumn;
use Illuminate\Support\ServiceProvider;

class ColumnServiceProvider extends ServiceProvider
{
    public function register()
    {
        TableColumn::register('action', \SleepingOwl\Admin\Display\Column\Action::class);
        TableColumn::register('checkbox', \SleepingOwl\Admin\Display\Column\Checkbox::class);
        TableColumn::register('control', \SleepingOwl\Admin\Display\Column\Control::class);
        TableColumn::register('count', \SleepingOwl\Admin\Display\Column\Count::class);
        TableColumn::register('custom', \SleepingOwl\Admin\Display\Column\Custom::class);
        TableColumn::register('datetime', \SleepingOwl\Admin\Display\Column\DateTime::class);
        TableColumn::register('filter', \SleepingOwl\Admin\Display\Column\Filter::class);
        TableColumn::register('image', \SleepingOwl\Admin\Display\Column\Image::class);
        TableColumn::register('lists', \SleepingOwl\Admin\Display\Column\Lists::class);
        TableColumn::register('order', \SleepingOwl\Admin\Display\Column\Order::class);
        TableColumn::register('text', \SleepingOwl\Admin\Display\Column\Text::class);
        TableColumn::register('link', \SleepingOwl\Admin\Display\Column\Link::class);
        TableColumn::register('email', \SleepingOwl\Admin\Display\Column\Email::class);
        TableColumn::register('treeControl', \SleepingOwl\Admin\Display\Column\TreeControl::class);
        TableColumn::register('url', \SleepingOwl\Admin\Display\Column\Url::class);
    }
}
