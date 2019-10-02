<?php

namespace SleepingOwl\Admin\Contracts\Display;

use Illuminate\Http\Request;

interface ColumnEditableInterface extends ColumnInterface
{
    /**
     * @param \Illuminate\Http\Request $request
     *
     * @return void
     */
    public function save(Request $request);
}
