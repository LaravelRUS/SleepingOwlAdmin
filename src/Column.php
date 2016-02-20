<?php

namespace SleepingOwl\Admin;

/**
 * @method static \SleepingOwl\Admin\Column\Action action($name)
 * @method static \SleepingOwl\Admin\Column\Checkbox checkbox()
 * @method static \SleepingOwl\Admin\Column\Control control()
 * @method static \SleepingOwl\Admin\Column\Count count($name)
 * @method static \SleepingOwl\Admin\Column\Custom custom()
 * @method static \SleepingOwl\Admin\Column\DateTime datetime($name)
 * @method static \SleepingOwl\Admin\Column\Filter filter($name)
 * @method static \SleepingOwl\Admin\Column\Image image($name)
 * @method static \SleepingOwl\Admin\Column\Lists lists($name)
 * @method static \SleepingOwl\Admin\Column\Order order()
 * @method static \SleepingOwl\Admin\Column\String string($name)
 * @method static \SleepingOwl\Admin\Column\Link link($name)
 * @method static \SleepingOwl\Admin\Column\Email email($name)
 * @method static \SleepingOwl\Admin\Column\TreeControl treeControl()
 * @method static \SleepingOwl\Admin\Column\Url url($name)
 */
class Column extends AliasBinder
{
    /**
     * Column class aliases.
     * @var string[]
     */
    protected static $aliases = [];
}
