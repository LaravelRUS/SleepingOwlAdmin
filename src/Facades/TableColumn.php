<?php

namespace SleepingOwl\Admin\Facades;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Facade;

/**
 * @method static \SleepingOwl\Admin\Display\Column\Action action($name)
 * @method static \SleepingOwl\Admin\Display\Column\Checkbox checkbox($label = null)
 * @method static \SleepingOwl\Admin\Display\Column\Control control($label = null)
 * @method static \SleepingOwl\Admin\Display\Column\Count count($name, $label = null)
 * @method static \SleepingOwl\Admin\Display\Column\Custom custom($label = null)
 * @method static \SleepingOwl\Admin\Display\Column\DateTime datetime($name, $label = null)
 * @method static \SleepingOwl\Admin\Display\Column\Filter filter($name, $label = null)
 * @method static \SleepingOwl\Admin\Display\Column\Image image($name, $label = null)
 * @method static \SleepingOwl\Admin\Display\Column\Lists lists($name, $label = null)
 * @method static \SleepingOwl\Admin\Display\Column\Order order()
 * @method static \SleepingOwl\Admin\Display\Column\Text text($name, $label = null)
 * @method static \SleepingOwl\Admin\Display\Column\Link link($name, $label = null)
 * @method static \SleepingOwl\Admin\Display\Column\RelatedLink relatedLink($name, $label = null, Model $model = null)
 * @method static \SleepingOwl\Admin\Display\Column\Email email($name, $label = null)
 * @method static \SleepingOwl\Admin\Display\Column\TreeControl treeControl()
 * @method static \SleepingOwl\Admin\Display\Column\Url url($name, $label = null)
 */
class TableColumn extends Facade
{
    public static function getFacadeAccessor()
    {
        return 'sleeping_owl.table.column';
    }
}
