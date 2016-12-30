<?php

namespace SleepingOwl\Admin\Display;

use Illuminate\Support\Collection;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Contracts\Display\Placable;
use SleepingOwl\Admin\Contracts\Display\DisplayExtensionInterface;

class ExtensionCollection extends Collection
{
    /**
     * @return static
     */
    public function placable()
    {
        return $this->filter(function (DisplayExtensionInterface $extension) {
            return $extension instanceof Placable;
        });
    }

    /**
     * @return array
     */
    public function placableBlocks()
    {
        $blocks = [];

        foreach ($this->placable() as $extension) {
            $blocks[$extension->getPlacement()][] = app('sleeping_owl.template')->view(
                $extension->getView(),
                $extension->toArray()
            )->render();
        }

        return $blocks;
    }

    /**
     * @return static
     */
    public function renderable()
    {
        return $this->filter(function (DisplayExtensionInterface $extension) {
            return $extension instanceof Renderable;
        });
    }

    /**
     * @return static
     */
    public function sortByOrder()
    {
        return $this->sortBy(function (DisplayExtensionInterface $extension) {
            return $extension->getOrder();
        });
    }

    /**
     * @return $this
     */
    public function initialize()
    {
        $this->each(function (DisplayExtensionInterface $extension) {
            if ($extension instanceof Initializable) {
                $extension->initialize();
            }
        });

        return $this;
    }

    /**
     * @return $this
     */
    public function modifyQuery(\Illuminate\Database\Eloquent\Builder $query)
    {
        $this->each(function (DisplayExtensionInterface $extension) use ($query) {
            $extension->modifyQuery($query);
        });

        return $this;
    }
}
