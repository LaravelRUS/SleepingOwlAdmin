<?php

namespace SleepingOwl\Admin\Form\Element;

use Carbon\Carbon;

class Timestamp extends DateTime
{
    /**
     * @var bool
     */
    protected $seconds = true;

    /**
     * @var string
     */
    protected $view = 'form.element.timestamp';
}
