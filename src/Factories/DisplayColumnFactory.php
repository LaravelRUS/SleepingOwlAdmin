<?php

namespace SleepingOwl\Admin\Factories;

use Illuminate\Contracts\Foundation\Application;
use SleepingOwl\Admin\AliasBinder;
use SleepingOwl\Admin\Contracts\Display\DisplayColumnFactoryInterface;
use SleepingOwl\Admin\Display\Column;

/**
 * @method Column\Index index($title = null)
 * @method Column\Action action($name, $title = null)
 * @method Column\Checkbox checkbox($label = null)
 * @method Column\Control control($label = null)
 * @method Column\Count count($name, $label = null, $small = null)
 * @method Column\Custom custom($label = null, \Closure $callback = null)
 * @method Column\DateTime datetime($name, $label = null, $small = null)
 * @method Column\Filter filter($name, $label = null, $small = null)
 * @method Column\Image image($name, $label = null, $small = null)
 * @method Column\Lists lists($name, $label = null, $small = null)
 * @method Column\Order order()
 * @method Column\Text|Column\Boolean text($name, $label = null, $small = null)
 * @method Column\Link link($name, $label = null, $small = null)
 * @method Column\RelatedLink relatedLink($name, $label = null, $small = null)
 * @method Column\Email email($name, $label = null, $small = null)
 * @method Column\TreeControl treeControl()
 * @method Column\Url url($name, $label = null, $small = null)
 */
class DisplayColumnFactory extends AliasBinder implements DisplayColumnFactoryInterface
{
    /**
     * DisplayColumnFactory constructor.
     *
     * @param  \Illuminate\Contracts\Foundation\Application  $application
     */
    public function __construct(Application $application)
    {
        parent::__construct($application);

        $this->register([
            'index' => Column\Index::class,
            'action' => Column\Action::class,
            'checkbox' => Column\Checkbox::class,
            'control' => Column\Control::class,
            'count' => Column\Count::class,
            'custom' => Column\Custom::class,
            'datetime' => Column\DateTime::class,
            'filter' => Column\Filter::class,
            'image' => Column\Image::class,
            'gravatar' => Column\Gravatar::class,
            'lists' => Column\Lists::class,
            'order' => Column\Order::class,
            'text' => Column\Text::class,
            'boolean' => Column\Boolean::class,
            'link' => Column\Link::class,
            'relatedLink' => Column\RelatedLink::class,
            'email' => Column\Email::class,
            'treeControl' => Column\TreeControl::class,
            'url' => Column\Url::class,
        ]);
    }
}
