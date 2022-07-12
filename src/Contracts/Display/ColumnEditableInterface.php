<?php

namespace SleepingOwl\Admin\Contracts\Display;

use Closure;
use Illuminate\Http\Request;

interface ColumnEditableInterface extends ColumnInterface
{
    /**
     * @param  Request  $request
     * @return void
     */
    public function save(Request $request);

    /**
     * @param bool|Closure $readonlyEditable
     * @return $this
     */
    public function setReadonly(bool|Closure $readonlyEditable);

    /**
     * @param bool $setIsolated
     * @return $this
     */
    public function setIsolated(bool $setIsolated);
}
