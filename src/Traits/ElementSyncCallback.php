<?php

namespace SleepingOwl\Admin\Traits;

use Closure;
use SleepingOwl\Admin\Contracts\Form\Element\HasSyncCallback;

trait ElementSyncCallback
{
    /**
     * @var Closure
     */
    protected Closure $syncCallback;

    /**
     * @return Closure
     */
    public function getSyncCallback(): Closure
    {
        return $this->syncCallback;
    }

    /**
     * @param  Closure  $callable
     * @return HasSyncCallback
     */
    public function setSyncCallback(Closure $callable): HasSyncCallback
    {
        $this->syncCallback = $callable;

        return $this;
    }
}
