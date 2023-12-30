<?php

namespace SleepingOwl\Admin\Contracts\Display;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Renderable;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Contracts\WithModelInterface;

interface ColumnInterface extends Initializable, Renderable, Arrayable, WithModelInterface
{
    /**
     * @return int|string
     */
    public function getWidth();

    /**
     * @return TableHeaderColumnInterface
     */
    public function getHeader();

    /**
     * @param  bool|OrderByClauseInterface  $clause
     * @return $this
     */
    public function setOrderable($clause);

    /**
     * @return bool
     */
    public function isOrderable();

    /**
     * @return bool
     */
    public function isVisible();

    /**
     * @return bool
     */
    public function isSearchable();
}
