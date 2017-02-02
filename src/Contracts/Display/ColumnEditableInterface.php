<?php

namespace SleepingOwl\Admin\Contracts\Display;

interface ColumnEditableInterface extends ColumnInterface
{
    /**
     * @param \Illuminate\Http\Request $request
     *
     * @return void
     */
    public function save(\Illuminate\Http\Request $request);
}
