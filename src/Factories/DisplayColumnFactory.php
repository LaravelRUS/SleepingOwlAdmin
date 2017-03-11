<?php

namespace SleepingOwl\Admin\Factories;

use SleepingOwl\Admin\AliasBinder;
use SleepingOwl\Admin\Display\Column;
use SleepingOwl\Admin\Contracts\Display\DisplayColumnFactoryInterface;

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
class DisplayColumnFactory extends AliasBinder implements DisplayColumnFactoryInterface
{
    /**
     * DisplayColumnFactory constructor.
     *
     * @param \Illuminate\Contracts\Foundation\Application $application
     */
    public function __construct(\Illuminate\Contracts\Foundation\Application $application)
    {
        parent::__construct($application);

        $this->register([
            'action' => Column\Action::class,
            'checkbox' => Column\Checkbox::class,
            'control' => Column\Control::class,
            'count' => Column\Count::class,
            'custom' => Column\Custom::class,
            'datetime' => Column\DateTime::class,
            'filter' => Column\Filter::class,
            'image' => Column\Image::class,
            'lists' => Column\Lists::class,
            'order' => Column\Order::class,
            'text' => Column\Text::class,
            'link' => Column\Link::class,
            'relatedLink' => Column\RelatedLink::class,
            'email' => Column\Email::class,
            'treeControl' => Column\TreeControl::class,
            'url' => Column\Url::class,
        ]);
    }
}
