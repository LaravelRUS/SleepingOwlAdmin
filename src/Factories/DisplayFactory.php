<?php

namespace SleepingOwl\Admin\Factories;

use SleepingOwl\Admin\AliasBinder;
use SleepingOwl\Admin\Navigation\Page;
use SleepingOwl\Admin\Display\DisplayTab;
use SleepingOwl\Admin\Display\DisplayTree;
use SleepingOwl\Admin\Display\DisplayTable;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Display\DisplayTabbed;
use SleepingOwl\Admin\Contracts\AdminInterface;
use Illuminate\Contracts\Foundation\Application;
use SleepingOwl\Admin\Display\DisplayDatatables;
use SleepingOwl\Admin\Display\DisplayDatatablesAsync;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Contracts\Display\DisplayFactoryInterface;

/**
 * @method DisplayDatatables datatables()
 * @method DisplayDatatablesAsync datatablesAsync()
 * @method DisplayTab tab(Renderable $display)
 * @method DisplayTabbed tabbed(\Closure|array $tabs = null)
 * @method DisplayTable table()
 * @method DisplayTree tree()
 * @method Page page()
 */
class DisplayFactory extends AliasBinder implements DisplayFactoryInterface
{
    /**
     * @var AdminInterface
     */
    protected $admin;

    /**
     * DisplayFactory constructor.
     *
     * @param Application $application
     * @param AdminInterface $admin
     */
    public function __construct(Application $application, AdminInterface $admin)
    {
        parent::__construct($application);

        $this->register([
            'datatables' => DisplayDatatables::class,
            'datatablesAsync' => DisplayDatatablesAsync::class,
            'tab' => DisplayTab::class,
            'tabbed' => DisplayTabbed::class,
            'table' => DisplayTable::class,
            'tree' => DisplayTree::class,

            'page' => Page::class,
        ]);

        $this->admin = $admin;
    }

    /**
     * @param string $alias
     * @param array $arguments
     *
     * @return object
     */
    public function makeClass($alias, array $arguments)
    {
        if ($alias == 'page') {
            $this->app->when(Page::class)
                  ->needs(ModelConfigurationInterface::class)
                  ->give(function ($app) use ($arguments) {
                      return $this->admin->getModel(
                          array_shift($arguments)
                      );
                  });

            return $this->app->make($this->getAlias($alias));
        }

        return parent::makeClass($alias, $arguments);
    }
}
