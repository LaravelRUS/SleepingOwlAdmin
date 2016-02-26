<?php

namespace SleepingOwl\Admin;

/**
 * @method static \SleepingOwl\Admin\Display\Column\Action action($name)
 * @method static \SleepingOwl\Admin\Display\Column\Checkbox checkbox()
 * @method static \SleepingOwl\Admin\Display\Column\Control control()
 * @method static \SleepingOwl\Admin\Display\Column\Count count($name)
 * @method static \SleepingOwl\Admin\Display\Column\Custom custom()
 * @method static \SleepingOwl\Admin\Display\Column\DateTime datetime($name)
 * @method static \SleepingOwl\Admin\Display\Column\Filter filter($name)
 * @method static \SleepingOwl\Admin\Display\Column\Image image($name)
 * @method static \SleepingOwl\Admin\Display\Column\Lists lists($name)
 * @method static \SleepingOwl\Admin\Display\Column\Order order()
 * @method static \SleepingOwl\Admin\Display\Column\Text text($name)
 * @method static \SleepingOwl\Admin\Display\Column\Link link($name)
 * @method static \SleepingOwl\Admin\Display\Column\RelatedLink relatedLink($name, $model)
 * @method static \SleepingOwl\Admin\Display\Column\Email email($name)
 * @method static \SleepingOwl\Admin\Display\Column\TreeControl treeControl()
 * @method static \SleepingOwl\Admin\Display\Column\Url url($name)
 */
class TableColumn extends AliasBinder
{
    /**
     * Column class aliases.
     * @var string[]
     */
    protected static $aliases = [];
}
