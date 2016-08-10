<?php

namespace SleepingOwl\Admin\Factories;

use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\AliasBinder;
use SleepingOwl\Admin\Contracts\Display\DisplayFactoryInterface;
use SleepingOwl\Admin\Display\DisplayDatatables;
use SleepingOwl\Admin\Display\DisplayDatatablesAsync;
use SleepingOwl\Admin\Display\DisplayTab;
use SleepingOwl\Admin\Display\DisplayTabbed;
use SleepingOwl\Admin\Display\DisplayTable;
use SleepingOwl\Admin\Display\DisplayTree;

/**
 * @method DisplayDatatables datatables()
 * @method DisplayDatatablesAsync datatablesAsync()
 * @method DisplayTab tab(Renderable $display)
 * @method DisplayTabbed tabbed(\Closure|array $tabs = null)
 * @method DisplayTable table()
 * @method DisplayTree tree()
 */
class DisplayFactory extends AliasBinder implements DisplayFactoryInterface
{

    /**
     * DisplayFactory constructor.
     *
     * @param \Illuminate\Contracts\Foundation\Application $application
     */
    public function __construct(\Illuminate\Contracts\Foundation\Application $application)
    {
        parent::__construct($application);

        $this->register([
            'datatables' => DisplayDatatables::class,
            'datatablesAsync' => DisplayDatatablesAsync::class,
            'tab' => DisplayTab::class,
            'tabbed' => DisplayTabbed::class,
            'table' => DisplayTable::class,
            'tree' => DisplayTree::class,
        ]);
    }
}
