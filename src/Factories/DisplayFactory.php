<?php

namespace SleepingOwl\Admin\Factories;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\AliasBinder;
use SleepingOwl\Admin\Contracts\Display\DisplayFactoryInterface;
use SleepingOwl\Admin\Display\DisplayDatatablesAsync;
use SleepingOwl\Admin\Display\DisplayDatatablesAsyncAlterPaginate;
use SleepingOwl\Admin\Display\DisplayTab;
use SleepingOwl\Admin\Display\DisplayTabbed;
use SleepingOwl\Admin\Display\DisplayTable;
use SleepingOwl\Admin\Display\DisplayTree;
use SleepingOwl\Admin\Navigation\Page;

/**
 * @method DisplayDatatablesAsync datatables()
 * @method DisplayDatatablesAsync datatablesAsync()
 * @method DisplayTab tab(Renderable $display, $label = null, $icon = null)
 * @method DisplayTabbed tabbed(\Closure|array $tabs = null)
 * @method DisplayTable table()
 * @method DisplayTree tree()
 * @method Page page()
 */
class DisplayFactory extends AliasBinder implements DisplayFactoryInterface
{
    /**
     * DisplayFactory constructor.
     *
     * @param  Application  $application
     */
    public function __construct(Application $application)
    {
        parent::__construct($application);

        $this->register([
            'datatables' => DisplayDatatablesAsync::class,
            'datatablesAsync' => DisplayDatatablesAsync::class,
            'tab' => DisplayTab::class,
            'tabbed' => DisplayTabbed::class,
            'table' => DisplayTable::class,
            'tree' => DisplayTree::class,
            'page' => Page::class,
            'datatablesAsyncAlterPaginate' => DisplayDatatablesAsyncAlterPaginate::class,
        ]);
    }
}
