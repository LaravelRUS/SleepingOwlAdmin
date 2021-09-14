<?php

namespace SleepingOwl\Admin\Display\Extension;

use Illuminate\Support\Collection;
use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\Display\Extension\ActionInterface;
use SleepingOwl\Admin\Contracts\Display\Placable;
use SleepingOwl\Admin\Contracts\Initializable;

class Actions extends Extension implements Initializable, Placable
{
    use HtmlAttributes;

    /**
     * @var ActionInterface[]|Collection
     */
    protected $actions;

    /**
     * @var string|\Illuminate\View\View
     */
    protected $view = 'display.extensions.actions';

    /**
     * @var string
     */
    protected $placement = 'card.buttons';

    public function __construct()
    {
        $this->clear();
    }

    /**
     * @return $this
     */
    public function clear()
    {
        $this->actions = new Collection();

        return $this;
    }

    /**
     * @param  ActionInterface  $actions
     * @return \SleepingOwl\Admin\Contracts\Display\DisplayInterface
     */
    public function set($actions = null)
    {
        if (! is_array($actions)) {
            $actions = func_get_args();
        }

        $this->clear();

        foreach ($actions as $action) {
            $this->push($action);
        }

        return $this->getDisplay();
    }

    /**
     * @return Collection|ActionInterface[]
     */
    public function all()
    {
        return $this->actions;
    }

    /**
     * @param  ActionInterface  $action
     * @return $this
     */
    public function push(ActionInterface $action)
    {
        $this->actions->push($action);

        return $this;
    }

    /**
     * @return string|\Illuminate\View\View
     */
    public function getView()
    {
        return $this->view;
    }

    /**
     * @param  string|\Illuminate\View\View  $view
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
    public function getPlacement()
    {
        return $this->placement;
    }

    /**
     * @param  string  $placement
     * @return $this
     */
    public function setPlacement($placement)
    {
        $this->placement = $placement;

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
            'actions' => $this->actions,
            'placement' => $this->getPlacement(),
            'attributes' => $this->htmlAttributesToString(),
        ];
    }

    /**
     * Initialize class.
     */
    public function initialize()
    {
        if ($this->all()->count() < 1) {
            return;
        }

        $this->all()->each(function (ActionInterface $action) {
            $action->initialize();
        });

        $this->setHtmlAttribute('data-type', 'display-actions');

        /*
          * @deprecated panel.footer
          */
        if ($this->getPlacement() == 'card.footer' || $this->getPlacement() == 'panel.footer') {
            $this->setHtmlAttribute('class', 'card-footer');
        } else {
            $this->setHtmlAttribute('style', 'display:inline-flex');
        }
    }
}
