<?php

namespace SleepingOwl\Admin\Contracts\Display;

use SleepingOwl\Admin\Display\Column;

/**
 * @method Column\Action action($name, $title = null)
 * @method Column\Checkbox checkbox($label = null)
 * @method Column\Control control($label = null)
 * @method Column\Count count($name, $label = null)
 * @method Column\Custom custom($label = null, \Closure $callback = null)
 * @method Column\DateTime datetime($name, $label = null)
 * @method Column\Filter filter($name, $label = null)
 * @method Column\Image image($name, $label = null)
 * @method Column\Lists lists($name, $label = null)
 * @method Column\Order order()
 * @method Column\Text text($name, $label = null)
 * @method Column\Link link($name, $label = null)
 * @method Column\RelatedLink relatedLink($name, $label = null)
 * @method Column\Email email($name, $label = null)
 * @method Column\TreeControl treeControl()
 * @method Column\Url url($name, $label = null)
 */
interface DisplayColumnFactoryInterface
{
}
