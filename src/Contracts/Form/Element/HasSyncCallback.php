<?php

namespace SleepingOwl\Admin\Contracts\Form\Element;

use Closure;

interface HasSyncCallback
{
    /**
     * @return Closure
     */
    public function getSyncCallback(): Closure;

    /**
     * @param Closure $callable
     * @return $this
     */
    public function setSyncCallback(Closure $callable): HasSyncCallback;
}
