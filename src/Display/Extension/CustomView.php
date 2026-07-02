<?php

namespace SleepingOwl\Admin\Display\Extension;

use SleepingOwl\Admin\Contracts\Display\Placable;

class CustomView extends Extension implements Placable
{
    /**
     * @var string
     */
    protected $view;

    /**
     * @var string
     */
    protected $placement;

    /**
     * @var array
     */
    protected $data = [];

    /**
     * CustomView constructor.
     *
     * @param string $view
     * @param string $placement
     * @param array $data
     */
    public function __construct($view, $placement = 'before.card', array $data = [])
    {
        $this->view = $view;
        $this->placement = $placement;
        $this->data = $data;
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
     * @param string $placement
     * @return $this
     */
    public function setPlacement($placement)
    {
        $this->placement = $placement;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return $this->data;
    }

    /**
     * @param array $data
     * @return $this
     */
    public function setData(array $data)
    {
        $this->data = $data;

        return $this;
    }
}
