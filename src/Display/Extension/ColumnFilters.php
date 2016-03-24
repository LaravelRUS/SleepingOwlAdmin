<?php

namespace SleepingOwl\Admin\Display\Extension;

use Illuminate\Support\Collection;
use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Contracts\ColumnFilterInterface;

class ColumnFilters extends Extension implements Initializable
{
    use HtmlAttributes;

    /**
     * @var ColumnFilterInterface[]
     */
    protected $columnFilters = [];

    /**
     * @var string
     */
    protected $view = 'display.extensions.columns_filters';

    /**
     * @var string
     */
    protected $position = 'table.footer';

    /**
     * @param array|ColumnFilterInterface $columnFilters
     *
     * @return $this
     */
    public function set($columnFilters)
    {
        if (! is_array($columnFilters)) {
            $columnFilters = func_get_args();
        }

        $this->columnFilters = [];

        foreach ($columnFilters as $filter) {
            $this->push($filter);
        }

        return $this;
    }

    /**
     * @return Collection|\SleepingOwl\Admin\Contracts\ActionInterface[]
     */
    public function all()
    {
        return $this->columnFilters;
    }

    /**
     * @param ColumnFilterInterface $filter
     *
     * @return $this
     */
    public function push(ColumnFilterInterface $filter = null)
    {
        $this->columnFilters[] = $filter;

        return $this;
    }

    /**
     * @return string
     */
    public function getView()
    {
        return $this->view;
    }

    /**
     * @param string $view
     *
     * @return $this
     */
    public function setView($view)
    {
        $this->view = $view;

        return $this;
    }

    /**
     * @return string
     */
    public function getPosition()
    {
        return $this->position;
    }

    /**
     * @param string $position
     *
     * @return $this
     */
    public function setPosition($position)
    {
        $this->position = $position;

        return $this;
    }

    /**
     * Get the instance as an array.
     *
     * @return array
     */
    public function toArray()
    {
        return [
            'filters'    => $this->columnFilters,
            'attributes' => $this->htmlAttributesToString(),
        ];
    }

    /**
     * Initialize class.
     */
    public function initialize()
    {
        if (empty($this->columnFilters)) {
            return;
        }

        foreach ($this->all() as $filter) {
            if ($filter instanceof Initializable) {
                $filter->initialize();
            }
        }

        if (! $this->hasHtmlAttribute('class')) {
            $this->setHtmlAttribute('class', 'panel-footer');
        }

        $template = app('sleeping_owl.template')->getViewPath($this->getDisplay()->getView());

        view()->composer($template, function (\Illuminate\View\View $view) {
            $view->getFactory()->inject(
                $this->getPosition(),
                app('sleeping_owl.template')->view($this->getView(), $this->toArray())
            );
        });
    }
}
