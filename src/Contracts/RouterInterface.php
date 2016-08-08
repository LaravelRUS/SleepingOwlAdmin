<?php

namespace SleepingOwl\Admin\Contracts;

interface RouterInterface
{
    /**
     * Register admin routes.
     *
     * @param \Closure $closure
     */
    public function register(\Closure $closure);
}
