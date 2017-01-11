<?php

namespace SleepingOwl\Admin\Contracts\Display;

use SleepingOwl\Admin\Contracts\ColumnInterface;

interface ColumnEditableInterface extends ColumnInterface
{
    /**
     * @param \Illuminate\Http\Request $request
     *
     * @return void
     */
    public function save(\Illuminate\Http\Request $request);
}
