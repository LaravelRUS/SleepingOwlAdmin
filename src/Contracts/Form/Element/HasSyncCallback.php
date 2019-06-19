<?php

namespace SleepingOwl\Admin\Contracts\Form\Element;

interface HasSyncCallback
{
    /**
     * @return \Closure
     */
    public function getSyncCallback();

    /**
     * @param \Closure $callable
     * @return $this
     */
    public function setSyncCallback(\Closure $callable);
}
