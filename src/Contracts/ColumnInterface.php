<?php

namespace SleepingOwl\Admin\Contracts;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Contracts\Display\OrderByClauseInterface;
use SleepingOwl\Admin\Contracts\Display\TableHeaderColumnInterface;

interface ColumnInterface extends Initializable, Renderable, Arrayable, WithModel
{
    /**
     * @return int
     */
    public function getWidth();

    /**
     * @return TableHeaderColumnInterface
     */
    public function getHeader();

    /**
     * @param bool|OrderByClauseInterface $clause
     *
     * @return $this
     */
    public function setOrderable($clause);

    /**
     * @return bool
     */
    public function isOrderable();
}
