<?php

namespace SleepingOwl\Admin\Traits;

trait ElementSyncCallback
{
    /**
     * @var \Closure
     */
    protected $syncCallback;

    /**
     * @return \Closure
     */
    public function getSyncCallback()
    {
        return $this->syncCallback;
    }

    /**
     * @param  \Closure  $callable
     * @return $this
     */
    public function setSyncCallback(\Closure $callable)
    {
        $this->syncCallback = $callable;

        return $this;
    }
}
