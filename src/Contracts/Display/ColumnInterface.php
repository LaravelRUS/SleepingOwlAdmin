<?php

namespace SleepingOwl\Admin\Contracts\Display;

use SleepingOwl\Admin\Contracts\WithModelInterface;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Contracts\Initializable;

interface ColumnInterface extends Initializable, Renderable, Arrayable, WithModelInterface
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
