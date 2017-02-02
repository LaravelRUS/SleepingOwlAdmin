<?php

namespace SleepingOwl\Admin\Contracts\Display;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Contracts\WithModel;

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
