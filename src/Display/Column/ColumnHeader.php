<?php

namespace SleepingOwl\Admin\Display\Column;

use Illuminate\Contracts\Support\Renderable;

class ColumnHeader implements Renderable
{
    /**
     * Header title.
     * @var string
     */
    protected $title;

    /**
     * Is column orderable?
     * @var bool
     */
    protected $orderable = true;

    /**
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * @param string $title
     *
     * @return $this
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @return bool
     */
    public function isOrderable()
    {
        return $this->orderable;
    }

    /**
     * @param bool $orderable
     */
    public function setOrderable($orderable)
    {
        $this->orderable = (bool) $orderable;
    }

    /**
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function render()
    {
        return app('sleeping_owl.template')->view('column.header', [
            'title'     => $this->getTitle(),
            'orderable' => $this->isOrderable() ? 'true' : 'false',
        ]);
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return (string) $this->render();
    }
}
