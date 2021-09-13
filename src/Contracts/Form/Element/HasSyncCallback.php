<?php

namespace SleepingOwl\Admin\Contracts\Form\Element;

use Closure;

interface HasSyncCallback
{
    /**
     * @return \Closure
     */
    public function getSyncCallback();

    /**
     * @param  \Closure  $callable
     * @return $this
     */
    public function setSyncCallback(Closure $callable);
}
