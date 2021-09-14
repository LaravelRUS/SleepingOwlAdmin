<?php

namespace SleepingOwl\Admin\Contracts\Display;

use Illuminate\Http\Request;

interface ColumnEditableInterface extends ColumnInterface
{
    /**
     * @param  \Illuminate\Http\Request  $request
     * @return void
     */
    public function save(Request $request);

    /**
     * @param  Closure|bool  $readonlyEditable
     * @return void
     */
    public function setReadonly($readonlyEditable);

    /**
     * @param  Closure|bool  $setIsolated
     * @return void
     */
    public function setIsolated($setIsolated);
}
