<?php

namespace SleepingOwl\Admin\Widgets;

use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\View\Factory;
use Illuminate\Support\Collection;
use Illuminate\View\View;
use SleepingOwl\Admin\Contracts\Widgets\WidgetInterface;
use SleepingOwl\Admin\Contracts\Widgets\WidgetsRegistryInterface;

class WidgetsRegistry implements WidgetsRegistryInterface
{
    /**
     * @var Collection|WidgetInterface[]
     */
    protected $widgets;

    /**
     * @var Container
     */
    private $container;

    /**
     * BlocksRegistry constructor.
     *
     * @param  Container  $container
     */
    public function __construct(Container $container)
    {
        $this->widgets = new Collection();
        $this->container = $container;
    }

    /**
     * @param $widget
     * @return $this
     */
    public function registerWidget($widget)
    {
        $this->widgets->push($widget);

        return $this;
    }

    /**
     * @param  Factory  $factory
     */
    public function placeWidgets(Factory $factory)
    {
        if ($this->widgets->count() === 0) {
            return;
        }

        $groupedBlocks = $this->widgets
            ->map(function ($class) {
                return $this->makeWidget($class);
            })
            ->filter(function (WidgetInterface $block) {
                return $block->active();
            })
            ->groupBy(function (WidgetInterface $block) {
                return $block->template();
            });

        foreach ($groupedBlocks as $template => $widgets) {
            $factory->composer($template, function (View $view) use ($widgets) {
                $factory = $view->getFactory();

                /** @var Collection|WidgetInterface[] $widgets */
                $widgets = $widgets->sortBy(function (WidgetInterface $block) {
                    return $block->position();
                });

                foreach ($widgets as $widget) {
                    $widget->setInjectableView($view);

                    $factory->startPush(
                        $widget->block(),
                        $widget->toHtml()
                    );
                }
            });
        }
    }

    /**
     * @param  mixed  $widget
     * @return mixed
     */
    public function makeWidget($widget)
    {
        return is_string($widget) ? $this->createClassWidget($widget) : $widget;
    }

    /**
     * @param $widget
     * @return \Closure
     */
    public function createClassWidget($widget)
    {
        return $this->container->make($widget);
    }
}
